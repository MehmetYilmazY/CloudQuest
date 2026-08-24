/* =========================================================================
   CloudQuest — `game` Edge Function  (Katman 1: sunucu otoritesi)
   -------------------------------------------------------------------------
   ÖDÜL OTORİTESİ. Komut kontrolü artık TARAYICIDA yapılıyor (anlık geri
   bildirim için); burası ilerlemenin YAZILDIĞI tek yer.

   İstemcinin hâlâ yapamadığı şey: kendine XP/level/credit/rozet yazmak.
   profiles üzerinde kolon bazlı GRANT duruyor, o kolonlara yalnızca bu
   fonksiyon (service_role ile) dokunabiliyor.

   Neyi KAYBETTİĞİMİZİ de yazalım, sonradan şaşırmayalım: sunucu adımları
   görmediği için "quest'i bitirdim" iddiası istemciden geliyor ve
   doğrulanamıyor. Kararlı biri quest'i oynamadan ödülünü alabilir.
   Bilinçli takas — bkz. docs/LAYER-1-SERVER-AUTHORITY.md.

   Eylemler (POST body: { action, ... }):
     complete  { questId, attempts? }        -> quest ödülü (quest başına TEK istek)
     hint      { questId, objIndex, free? }  -> ipucu metni
     purchase  { itemId }                    -> shop'tan satın al
     milestone { key }                       -> quest dışı rozet (rehber / test)
     reset     {}                            -> ilerlemeyi sıfırla

   Kimlik: Authorization: Bearer <supabase access token> (verify_jwt açık).
   Yazma:  service_role istemcisi (RLS'i baypas eder) — anahtar yalnızca
           sunucu ortamında bulunur, tarayıcıya ASLA gitmez.
   ========================================================================= */
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { applyAward, xpToNext, ANSWER_COST, type Progress } from "../_shared/progression.ts";
import curriculum from "../_shared/curriculum.json" with { type: "json" };

/* ----------------------------------------------------------------- tipler */
type Objective = { task: string; teach: string; expect: unknown; hint: string; success: string };
type Quest = {
  id: string; chapter?: number; title: string; requires: string[];
  xp: number; credits: number; badge?: string;
  brief: string[]; objectives: Objective[]; complete: string[];
};
type ShopItem = {
  id: number; name: string; cost: number;
  effect: { xp?: number; badge?: string; freeHints?: number };
};

/* Müfredat deploy anında bundle'a gömülür; her istekte tek Map araması. */
const QUESTS: Map<string, Quest> = new Map(
  [
    ...(curriculum.quests as Quest[]),
    ...(curriculum.modules as Array<{ quests: Quest[] }>).flatMap((m) => m.quests),
  ].map((q) => [q.id, q])
);
const SHOP: Map<number, ShopItem> = new Map(
  (curriculum.shop as ShopItem[]).map((s) => [s.id, s])
);

/* Quest dışı rozetler (rehber turu, uyum testi). Rozet adını ve XP'sini
   İSTEMCİ SEÇEMEZ — anahtar gönderir, karşılığı burada yazar. Her biri
   yalnızca bir kez ödüllendirilir (rozet zaten varsa ödül verilmez). */
const MILESTONES: Record<string, { badge: string; xp: number }> = {
  guide: { badge: "🧭 Yol Bulucu", xp: 40 },
  quiz: { badge: "🧪 Kendini Tanı", xp: 20 },   // quiz.html eskiden 20 veriyordu
};

/* ------------------------------------------------------------------ HTTP */
const CORS = {
  "Access-Control-Allow-Origin": Deno.env.get("CQ_ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
const fail = (message: string, status = 400) => json({ error: message }, status);

/* ------------------------------------------------------- profil yardımcı */
type ProfileRow = {
  id: string; level: number; xp: number; credits: number; rank: string;
  completed: string[]; badges: string[]; free_hints: number;
};

const toProgress = (r: ProfileRow): Progress => ({
  level: r.level, xp: r.xp, credits: r.credits, rank: r.rank,
  badges: r.badges ?? [], completed: r.completed ?? [], freeHints: r.free_hints ?? 0,
});

/** İstemciye dönen ilerleme özeti (HUD bunu doğrudan basar). */
const publicProgress = (p: Progress) => ({
  level: p.level, xp: p.xp, xpToNext: xpToNext(p.level), credits: p.credits,
  rank: p.rank, badges: p.badges, completed: p.completed, freeHints: p.freeHints,
});

async function loadProfile(db: SupabaseClient, userId: string): Promise<ProfileRow> {
  const { data, error } = await db.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) throw new Error("profil bulunamadi");
  return data as ProfileRow;
}

/**
 * İlerlemeyi iyimser kilitle yazar: satır bizim okuduğumuzdan beri
 * değiştiyse (paralel istek) yazma reddedilir ve çağıran tekrar dener.
 */
async function writeProgress(
  db: SupabaseClient, userId: string, before: Progress, after: Progress
): Promise<boolean> {
  const { data, error } = await db
    .from("profiles")
    .update({
      level: after.level, xp: after.xp, credits: after.credits, rank: after.rank,
      completed: after.completed, badges: after.badges, free_hints: after.freeHints,
    })
    .eq("id", userId)
    .eq("level", before.level)   // iyimser kilit: okuduğumuz hâl hâlâ geçerli mi?
    .eq("xp", before.xp)
    .eq("credits", before.credits)
    .select("id");
  return !error && !!data && data.length > 0;
}

/** Quest'in kilidi açık mı? (requires zinciri sunucuda da doğrulanır.) */
function isUnlocked(q: Quest, completed: string[]): boolean {
  return q.requires.every((r) => completed.includes(r));
}

/* ==================================================================== ana */
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("sadece POST", 405);

  /* Supabase iki anahtar adlandırması kullanıyor: eski projelerde
     SERVICE_ROLE/ANON, yeni API anahtar sistemine geçmiş projelerde
     SECRET/PUBLISHABLE. İkisini de kabul ediyoruz ki hangi projede
     deploy edilirse edilsin çalışsın. */
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY");
  if (!url || !serviceKey) {
    // Hangi değişkenin eksik olduğunu söyle: "sunucu hatasi" demek
    // saatlerce log okutuyor.
    console.error(
      "eksik ortam degiskeni:",
      !url ? "SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SECRET_KEY"
    );
    return fail("sunucu yapilandirilmamis", 500);
  }

  // 1) Kimlik: JWT'den kullanıcıyı çöz. İstemcinin gönderdiği "userId"e ASLA güvenilmez.
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return fail("giris gerekli", 401);

  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: userData, error: userErr } = await db.auth.getUser(token);
  if (userErr || !userData?.user) return fail("gecersiz oturum", 401);
  const userId = userData.user.id;

  // 2) Gövde
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("gecersiz JSON"); }
  const action = String(body.action ?? "");

  try {
    switch (action) {
      case "complete": return await handleComplete(db, userId, body);
      case "hint":     return await handleHint(db, userId, body);
      case "purchase": return await handlePurchase(db, userId, body);
      case "milestone": return await handleMilestone(db, userId, body);
      case "reset":    return await handleReset(db, userId, token, url);
      default:         return fail(`bilinmeyen action: ${action}`);
    }
  } catch (e) {
    console.error("game function hatasi:", e);
    return fail("sunucu hatasi", 500);
  }
});
/* ---------------------------------------------------------- complete ---- */
/**
 * Quest tamamlandı: ödülü ver. QUEST BAŞINA TEK İSTEK.
 *
 * Komut kontrolü tarayıcıda yapıldığı için sunucu adımları görmüyor; bu
 * çağrının "gerçekten çözdüm" iddiası istemciden geliyor. Yine de sunucu
 * iki şeyi doğruluyor:
 *   • quest'in kilidi açık mı (requires zinciri)
 *   • daha önce ödül alınmış mı (completed_at atomik olarak işaretlenir)
 * Ve XP/level/credits hesabını istemciye bırakmıyor — profiles'ta kolon
 * bazlı GRANT durduğu için konsoldan "level 99" hâlâ mümkün değil.
 */
async function handleComplete(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const questId = String(body.questId ?? "");
  const quest = QUESTS.get(questId);
  if (!quest) return fail("quest bulunamadi", 404);

  const profile = await loadProfile(db, userId);
  if (!isUnlocked(quest, profile.completed ?? [])) return fail("bu quest henuz kilitli", 403);

  /* Ödülü yalnızca İLK istek alır: completed_at NULL iken işaretleniyor.
     Çift tıklama, sekme yenileme veya kötü niyetli tekrar — hepsi burada
     kesiliyor. */
  const { data: claimed, error: claimErr } = await db
    .from("quest_progress")
    .upsert(
      { user_id: userId, quest_id: questId, obj_index: quest.objectives.length,
        completed_at: new Date().toISOString() },
      { onConflict: "user_id,quest_id", ignoreDuplicates: false }
    )
    .is("completed_at", null)
    .select("quest_id");

  if (claimErr) {
    console.error("quest_progress claim hatasi:", claimErr);
    return fail("ilerleme yazilamadi", 500);
  }
  if (!claimed || claimed.length === 0) {
    return json({ ok: true, alreadyCompleted: true });
  }

  await recordAttempts(db, userId, questId, body.attempts);

  // İyimser kilitle yaz; paralel istek araya girdiyse bir kez daha dene.
  for (let attempt = 0; attempt < 3; attempt++) {
    const fresh = attempt === 0 ? profile : await loadProfile(db, userId);
    const before = toProgress(fresh);
    const { next, leveledUp, levelsGained, newBadge } = applyAward(before, {
      xp: quest.xp, credits: quest.credits, badge: quest.badge, questId: quest.id,
    });
    if (await writeProgress(db, userId, before, next)) {
      return json({
        ok: true,
        alreadyCompleted: false,
        award: { xp: quest.xp, credits: quest.credits, badge: newBadge, leveledUp, levelsGained },
        progress: publicProgress(next),
      });
    }
  }
  return fail("ilerleme yazilamadi, tekrar dene", 503);
}

/**
 * Deneme telemetrisi. Artık her komutta ayrı istek gelmediği için istemci
 * denemeleri quest boyunca biriktirip burada TOPLU gönderiyor — ek istek
 * maliyeti sıfır, "oyuncular hangi adımda takılıyor" verisi korunuyor.
 *
 * Veri istemciden geldiği için kesin doğru değil; ürün analitiği için
 * yeterli, anti-cheat kanıtı olarak kullanılamaz.
 */
async function recordAttempts(
  db: SupabaseClient, userId: string, questId: string, raw: unknown
): Promise<void> {
  if (!Array.isArray(raw) || raw.length === 0) return;

  const rows = raw
    .slice(0, 200)                                   // şişirme koruması
    .filter((a): a is Record<string, unknown> => !!a && typeof a === "object")
    .map((a) => ({
      user_id: userId,
      quest_id: questId,
      obj_index: Number(a.objIndex) || 0,
      command: String(a.command ?? "").slice(0, 500),
      ok: !!a.ok,
    }))
    .filter((r) => r.command.length > 0);

  if (!rows.length) return;
  const { error } = await db.from("attempts").insert(rows);
  if (error) console.error("attempts yazilamadi:", error);   // oyunu bloklamaz
}

/* -------------------------------------------------------------- hint ---- */
/**
 * İpucu metnini (doğru komutu) döndürür. `hint` public bundle'da olmadığı
 * için buradan isteniyor.
 *
 * ⚠ DÜRÜST SINIR: `free` bayrağı istemciden geliyor ve sunucu artık yanlış
 * deneme sayısını bilmiyor (komut kontrolü tarayıcıda). Yani kredi bedelini
 * atlamak teknik olarak mümkün. Kredi ekonomisi bu kararla birlikte
 * "yumuşak" bir sınır hâline geldi — zaten `expect` spec'i bundle'da
 * olduğundan cevap türetilebilir durumda. Ekonomiyi tekrar bağlayıcı
 * yapmak istersek adım takibinin sunucuya dönmesi gerekir.
 */
async function handleHint(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const questId = String(body.questId ?? "");
  const quest = QUESTS.get(questId);
  if (!quest) return fail("quest bulunamadi", 404);

  const objIndex = Number(body.objIndex);
  const objective = quest.objectives[objIndex];
  if (!objective) return fail("gecersiz adim", 400);

  // Kaç ipucu kullanıldığı yine kayda geçsin (içerik zorluk analizi için).
  const bumpHint = () =>
    db.from("quest_progress").upsert(
      { user_id: userId, quest_id: questId, hints_used: 1 },
      { onConflict: "user_id,quest_id", ignoreDuplicates: true }
    );

  // 3 yanlış sonrası güvenlik ağı: bedelsiz.
  if (body.free === true) {
    await bumpHint();
    return json({ hint: objective.hint, paidWith: "free-safety-net" });
  }

  const profile = await loadProfile(db, userId);

  // 1) Ücretsiz ipucu hakkı (shop'tan alınmış)
  if ((profile.free_hints ?? 0) > 0) {
    const { data: spent } = await db
      .from("profiles")
      .update({ free_hints: profile.free_hints - 1 })
      .eq("id", userId)
      .eq("free_hints", profile.free_hints)     // atomik: aradan başka istek geçmesin
      .select("free_hints");
    if (spent && spent.length > 0) {
      await bumpHint();
      return json({ hint: objective.hint, paidWith: "free", freeHints: spent[0].free_hints });
    }
  }

  // 2) Kredi ile
  if ((profile.credits ?? 0) < ANSWER_COST) {
    return json({ error: "yetersiz kredi", cost: ANSWER_COST, credits: profile.credits }, 402);
  }
  const { data: paid } = await db
    .from("profiles")
    .update({ credits: profile.credits - ANSWER_COST })
    .eq("id", userId)
    .eq("credits", profile.credits)             // atomik
    .select("credits");
  if (!paid || paid.length === 0) return fail("odeme yapilamadi, tekrar dene", 409);

  await bumpHint();
  return json({ hint: objective.hint, paidWith: "credits", credits: paid[0].credits });
}

/* ---------------------------------------------------------- purchase ---- */
/** Shop satın alımı. Fiyat ve etki sunucudaki müfredattan okunur. */
async function handlePurchase(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const item = SHOP.get(Number(body.itemId));
  if (!item) return fail("urun bulunamadi", 404);

  for (let attempt = 0; attempt < 3; attempt++) {
    const profile = await loadProfile(db, userId);
    const before = toProgress(profile);

    if (before.credits < item.cost) {
      return json({ error: "yetersiz kredi", cost: item.cost, credits: before.credits }, 402);
    }
    if (item.effect.badge && before.badges.includes(item.effect.badge)) {
      return json({ error: "bu unvana zaten sahipsin" }, 409);
    }

    // Önce bedeli düş, sonra etkiyi uygula — ikisi de aynı yazmada.
    const spent: Progress = { ...before, credits: before.credits - item.cost };
    const { next, leveledUp, levelsGained, newBadge } = applyAward(spent, {
      xp: item.effect.xp, badge: item.effect.badge,
    });
    next.freeHints += item.effect.freeHints ?? 0;

    if (await writeProgress(db, userId, before, next)) {
      return json({
        ok: true,
        item: { id: item.id, name: item.name },
        award: { xp: item.effect.xp ?? 0, badge: newBadge, leveledUp, levelsGained },
        progress: publicProgress(next),
      });
    }
  }
  return fail("satin alma yazilamadi, tekrar dene", 503);
}

/* --------------------------------------------------------- milestone ---- */
/** Quest dışı rozet (rehber turu / uyum testi). Bir kez ödüllendirilir. */
async function handleMilestone(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const milestone = MILESTONES[String(body.key ?? "")];
  if (!milestone) return fail("bilinmeyen rozet", 404);

  for (let attempt = 0; attempt < 3; attempt++) {
    const profile = await loadProfile(db, userId);
    const before = toProgress(profile);

    // Zaten alınmışsa XP tekrar verilmez (sayfayı yenileyip biriktirmeyi engeller).
    if (before.badges.includes(milestone.badge)) {
      return json({ ok: true, alreadyOwned: true, progress: publicProgress(before) });
    }

    const { next, leveledUp, levelsGained, newBadge } = applyAward(before, {
      xp: milestone.xp, badge: milestone.badge,
    });
    if (await writeProgress(db, userId, before, next)) {
      return json({
        ok: true,
        alreadyOwned: false,
        award: { xp: milestone.xp, badge: newBadge, leveledUp, levelsGained },
        progress: publicProgress(next),
      });
    }
  }
  return fail("rozet yazilamadi, tekrar dene", 503);
}

/* ------------------------------------------------------------- reset ---- */
/** İlerlemeyi sıfırlar. İş Postgres'teki reset_progress() fonksiyonunda. */
async function handleReset(db: SupabaseClient, userId: string, token: string, url: string) {
  // Kullanıcının KENDİ token'ıyla çağırıyoruz: fonksiyon auth.uid()'e bakıyor.
  const anonKey =
    Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const asUser = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { error } = await asUser.rpc("reset_progress");
  if (error) return fail("sifirlanamadi: " + error.message, 500);

  const profile = await loadProfile(db, userId);
  return json({ ok: true, progress: publicProgress(toProgress(profile)) });
}
