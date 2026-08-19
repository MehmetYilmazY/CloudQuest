/* =========================================================================
   CloudQuest — `game` Edge Function  (Katman 1: sunucu otoritesi)
   -------------------------------------------------------------------------
   Oyunun "hakem"i burasıdır. İstemci artık şunları YAPAMAZ:
     • doğru cevabı bilmek        -> expect/hint bu tarafta kalır
     • adım atlamak               -> sırayı quest_progress tutar
     • kendine XP/credit yazmak   -> ödülü bu fonksiyon verir
     • ipucunu bedava almak       -> bedel burada tahsil edilir

   Eylemler (POST body: { action, ... }):
     start    { questId }                      -> quest'i başlat / kaldığın adım
     verify   { questId, command }             -> komutu doğrula, gerekirse ödüllendir
     hint     { questId }                      -> ipucunu satın al veya ücretsiz al
     purchase { itemId }                       -> shop'tan satın al
     reset    {}                               -> ilerlemeyi sıfırla

   Kimlik: Authorization: Bearer <supabase access token> (verify_jwt açık).
   Yazma:  service_role istemcisi (RLS'i baypas eder) — anahtar yalnızca
           sunucu ortamında bulunur, tarayıcıya ASLA gitmez.
   ========================================================================= */
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { match, type Expect } from "../_shared/parser.ts";
import {
  applyAward, xpToNext, ANSWER_COST, MAX_WRONG_BEFORE_ANSWER,
  type Progress,
} from "../_shared/progression.ts";
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

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return fail("sunucu yapilandirilmamis", 500);

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
      case "start":    return await handleStart(db, userId, body);
      case "verify":   return await handleVerify(db, userId, body);
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

/* ------------------------------------------------------------- start ---- */
/** Quest'i başlatır (veya yarım kalmışsa kaldığı adımı döndürür). */
async function handleStart(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const questId = String(body.questId ?? "");
  const quest = QUESTS.get(questId);
  if (!quest) return fail("quest bulunamadi", 404);

  const profile = await loadProfile(db, userId);
  if (!isUnlocked(quest, profile.completed ?? [])) return fail("bu quest henuz kilitli", 403);

  const { data: existing } = await db
    .from("quest_progress").select("*")
    .eq("user_id", userId).eq("quest_id", questId).maybeSingle();

  if (existing?.completed_at) {
    return json({ questId, objIndex: 0, total: quest.objectives.length, alreadyCompleted: true });
  }

  let objIndex = existing?.obj_index ?? 0;
  if (!existing) {
    await db.from("quest_progress").insert({ user_id: userId, quest_id: questId, obj_index: 0 });
    objIndex = 0;
  }

  return json({
    questId,
    objIndex,
    total: quest.objectives.length,
    wrongCount: existing?.wrong_count ?? 0,
    alreadyCompleted: false,
  });
}

/* ------------------------------------------------------------ verify ---- */
/**
 * Komutu doğrular. Doğruysa adımı ilerletir; son adımsa ödülü verir.
 * Ödül çift verilemez: completed_at'i atomik olarak "NULL iken" işaretleriz.
 */
async function handleVerify(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const questId = String(body.questId ?? "");
  const command = String(body.command ?? "").slice(0, 2000);
  const quest = QUESTS.get(questId);
  if (!quest) return fail("quest bulunamadi", 404);

  const { data: prog } = await db
    .from("quest_progress").select("*")
    .eq("user_id", userId).eq("quest_id", questId).maybeSingle();
  if (!prog) return fail("once quest'i baslat", 409);
  if (prog.completed_at) return fail("bu quest zaten tamamlandi", 409);

  const objIndex: number = prog.obj_index;
  const objective = quest.objectives[objIndex];
  if (!objective) return fail("gecersiz adim", 409);

  const ok = match(command, objective.expect as Expect);

  // Telemetri: doğru da yanlış da kaydedilir. Bilerek await ediliyor —
  // isolate istek biter bitmez donabilir, "ateşle ve unut" kayıp yazma demek.
  const { error: attemptErr } = await db
    .from("attempts")
    .insert({ user_id: userId, quest_id: questId, obj_index: objIndex, command, ok });
  if (attemptErr) console.error("attempt yazilamadi:", attemptErr);   // oyunu bloklamaz

  /* --- yanlış: sayaç artar, 3'ten sonra ücretsiz ipucu --------------------*/
  if (!ok) {
    const wrongCount = (prog.wrong_count ?? 0) + 1;
    await db.from("quest_progress").update({ wrong_count: wrongCount })
      .eq("user_id", userId).eq("quest_id", questId);

    const freeHint = wrongCount >= MAX_WRONG_BEFORE_ANSWER;
    if (freeHint) {
      // Güvenlik ağı: cevabı bedava göster ve sayacı sıfırla.
      await db.from("quest_progress").update({ wrong_count: 0 })
        .eq("user_id", userId).eq("quest_id", questId);
    }
    return json({
      ok: false,
      wrongCount: freeHint ? 0 : wrongCount,
      remaining: Math.max(0, MAX_WRONG_BEFORE_ANSWER - wrongCount),
      hint: freeHint ? objective.hint : undefined,   // ücretsiz güvenlik ağı
    });
  }

  /* --- doğru: adımı ilerlet ---------------------------------------------*/
  const nextIndex = objIndex + 1;
  const isLast = nextIndex >= quest.objectives.length;

  if (!isLast) {
    await db.from("quest_progress")
      .update({ obj_index: nextIndex, wrong_count: 0 })
      .eq("user_id", userId).eq("quest_id", questId);
    return json({
      ok: true,
      success: objective.success,
      objIndex: nextIndex,
      total: quest.objectives.length,
      questComplete: false,
    });
  }

  /* --- son adım: ödül. completed_at yarışı atomik olarak çözer ------------*/
  const { data: claimed } = await db
    .from("quest_progress")
    .update({ obj_index: nextIndex, wrong_count: 0, completed_at: new Date().toISOString() })
    .eq("user_id", userId).eq("quest_id", questId)
    .is("completed_at", null)          // <- ödülü yalnızca İLK istek alır
    .select("quest_id");

  if (!claimed || claimed.length === 0) {
    return json({ ok: true, success: objective.success, questComplete: true, award: null });
  }

  // İyimser kilitle yaz; paralel istek araya girdiyse bir kez daha dene.
  for (let attempt = 0; attempt < 3; attempt++) {
    const profile = await loadProfile(db, userId);
    const before = toProgress(profile);
    const { next, leveledUp, levelsGained, newBadge } = applyAward(before, {
      xp: quest.xp, credits: quest.credits, badge: quest.badge, questId: quest.id,
    });
    if (await writeProgress(db, userId, before, next)) {
      return json({
        ok: true,
        success: objective.success,
        questComplete: true,
        award: {
          xp: quest.xp, credits: quest.credits,
          badge: newBadge, leveledUp, levelsGained,
        },
        progress: publicProgress(next),
      });
    }
  }
  return fail("ilerleme yazilamadi, tekrar dene", 503);
}

/* -------------------------------------------------------------- hint ---- */
/**
 * İpucunu (doğru komutu) verir. Bedel önce tahsil edilir:
 *   • ücretsiz hakkı varsa haktan düşer
 *   • yoksa ANSWER_COST kadar kredi düşer
 * İkisi de atomik UPDATE ... WHERE ile yapılır; bakiye negatife düşemez.
 */
async function handleHint(db: SupabaseClient, userId: string, body: Record<string, unknown>) {
  const questId = String(body.questId ?? "");
  const quest = QUESTS.get(questId);
  if (!quest) return fail("quest bulunamadi", 404);

  const { data: prog } = await db
    .from("quest_progress").select("*")
    .eq("user_id", userId).eq("quest_id", questId).maybeSingle();
  if (!prog || prog.completed_at) return fail("aktif quest yok", 409);

  const objective = quest.objectives[prog.obj_index];
  if (!objective) return fail("gecersiz adim", 409);

  const profile = await loadProfile(db, userId);

  // 1) Ücretsiz hak
  if ((profile.free_hints ?? 0) > 0) {
    const { data: spent } = await db
      .from("profiles")
      .update({ free_hints: profile.free_hints - 1 })
      .eq("id", userId)
      .eq("free_hints", profile.free_hints)     // atomik: aradan başka istek geçmesin
      .select("free_hints");
    if (spent && spent.length > 0) {
      await db.from("quest_progress")
        .update({ hints_used: (prog.hints_used ?? 0) + 1 })
        .eq("user_id", userId).eq("quest_id", questId);
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

  await db.from("quest_progress")
    .update({ hints_used: (prog.hints_used ?? 0) + 1 })
    .eq("user_id", userId).eq("quest_id", questId);

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
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { error } = await asUser.rpc("reset_progress");
  if (error) return fail("sifirlanamadi: " + error.message, 500);

  const profile = await loadProfile(db, userId);
  return json({ ok: true, progress: publicProgress(toProgress(profile)) });
}
