/* =========================================================================
   CloudQuest build — SSOT derleyici
   -------------------------------------------------------------------------
     data/curriculum.json
        ├─> web/js/content.generated.js                (PUBLIC — tarayıcıya)
        └─> supabase/functions/_shared/curriculum.json (SECRET — sunucuya)
     shared/parser.ts
        └─> web/js/parser.js                           (tarayıcı parser'ı)

   PUBLIC bundle'da `hint` (doğru komutun metni) YOKTUR. `expect` ve
   `success` VARDIR: komut kontrolü tarayıcıda yapılıyor, çünkü her komutta
   sunucuya gidip beklemek terminalin anlık hissini bozuyordu. İpucu metni
   istendiğinde sunucudan çekilir; ödülü de sunucu verir.

   Kullanım:
     npm run build            derle
     npm run validate         sadece doğrula (dosya yazma)
     npm run build:check      CI: üretilen çıktı repodakiyle aynı mı?
   ========================================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stripTypeScriptTypes } from "node:module";
import { validateCurriculum } from "../shared/curriculum.validate.ts";
import { buildContent } from "./content.ts";
import type { Curriculum, Quest, Objective } from "../shared/curriculum.schema.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "data", "curriculum.json");
const PUBLIC_DST = join(ROOT, "web", "js", "content.generated.js");
const SECRET_DST = join(ROOT, "supabase", "functions", "_shared", "curriculum.json");

const args = new Set(process.argv.slice(2));
const VALIDATE_ONLY = args.has("--validate-only");
const CHECK = args.has("--check");

/* ---------------------------------------------------------------- helpers */
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

function fail(title: string, lines: string[] = []): never {
  console.error(red(`✖ ${title}`));
  for (const l of lines) console.error(`   • ${l}`);
  process.exit(1);
}

/**
 * scene.js sahneyi seçerken objective'in ilk komut kelimesine bakıyordu
 * (o.hint'in ilk token'ı). hint artık gizli, ama "hangi dünyada geçiyor"
 * bilgisi sır değil — bu yüzden sadece FİİLİ public'e taşıyoruz.
 * `docker ps` -> "docker". Komutun tamamı değil, tek kelime.
 */
function sceneVerb(o: Objective): string {
  return o.hint.trim().split(/\s+/)[0].toLowerCase();
}

/**
 * Bir quest'in public kopyası.
 *
 * KARAR (anlık geri bildirim): komut doğrulaması tarayıcıda yapılıyor, bu
 * yüzden `expect` spec'i ve doğru cevabın çıktısı (`success`) bundle'a
 * giriyor. Her tuşta sunucuya gidip 200ms beklemek oyunun en iyi yanını —
 * terminalin anlık hissini — bozuyordu.
 *
 * `hint` (doğru komutun METNİ) hâlâ DIŞARIDA: ipucu istendiğinde ya da üç
 * yanlıştan sonra sunucudan çekiliyor. Nadir bir çağrı olduğu için gecikme
 * hissedilmiyor, ama kopyala-yapıştır cevap listesi de bundle'da durmuyor.
 */
function publicQuest(q: Quest): unknown {
  return {
    ...q,
    objectives: q.objectives.map((o) => ({
      task: o.task,
      teach: o.teach,
      verb: sceneVerb(o),
      expect: o.expect,     // tarayıcı anlık doğrulama için okur
      success: o.success,   // doğru cevaptan sonra gösterilen çıktı
      // hint KASITLI OLARAK YOK — sunucuda kalır.
    })),
  };
}

/**
 * Tarayıcı parser'ını `shared/parser.ts`'ten üretir.
 *
 * Parser artık iki yerde çalışıyor: tarayıcıda (anlık kontrol) ve sunucuda
 * (ödül verilirken son doğrulama). İki elle yazılmış kopya tutmak, birinin
 * diğerinden ayrışıp "oyun doğru dedi, sunucu yanlış dedi" durumunu
 * yaratırdı — mümkün olan en kötü hata. Bu yüzden tek kaynak korunuyor:
 * TS tipleri Node'un resmî ayıklayıcısıyla sökülüp IIFE'ye sarılıyor.
 * shared/parser.test.ts üretilen dosyayı da ayrıca test ediyor.
 */
function browserParser(): string {
  const src = readFileSync(join(ROOT, "shared", "parser.ts"), "utf8");
  const stripped = stripTypeScriptTypes(src, { mode: "strip" })
    .replace(/^export\s+/gm, "")            // export -> yerel tanım
    .replace(/^\s*type .*$/gm, "")          // kalan tip satırları
    .split("\n")
    .map((l) => (l.trim() ? "  " + l : l))  // IIFE içine gir
    .join("\n");

  return `/* ======================================================================
   AUTO-GENERATED from shared/parser.ts — DO NOT EDIT.
   Uret: npm run build

   Ayni parser sunucuda da calisiyor (supabase/functions/_shared/parser.ts).
   Kaynagi tek: shared/parser.ts. Buradaki bir degisiklik bir sonraki
   build'de silinir; kurali degistirmek istiyorsan kaynagi duzenle.
   ====================================================================== */
var CQParser = (function () {
  "use strict";
${stripped}
  return { match: match, tokenize: tokenize, segments: segments };
})();
`;
}

function toPublic(c: Curriculum): unknown {
  return {
    _meta: {
      note: "AUTO-GENERATED. Komut kontrolu tarayicida (expect burada). Ipucu metni (hint) sunucuda; odul supabase/functions/game tarafindan verilir.",
    },
    chapters: c.chapters,
    tracks: c.tracks,
    story: c.story,
    quests: c.quests.map(publicQuest),
    modules: c.modules.map((m) => ({ ...m, quests: m.quests.map(publicQuest) })),
    shop: c.shop,
  };
}

function writeIfNeeded(path: string, content: string, label: string): boolean {
  const existing = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (existing === content) {
    console.log(dim(`  = ${label} (değişiklik yok)`));
    return false;
  }
  if (CHECK) {
    fail(
      `${label} güncel değil.`,
      ["`npm run build` çalıştırıp üretilen dosyayı commit'le."]
    );
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8"); // BOM yok: tarayıcı script tag'i temiz okusun
  console.log(green(`  ✓ ${label}`));
  return true;
}

/* ------------------------------------------------------------------- main */
if (!existsSync(SRC)) fail(`Kaynak bulunamadı: ${SRC}`);

let raw: unknown;
try {
  raw = JSON.parse(readFileSync(SRC, "utf8"));
} catch (e) {
  fail("data/curriculum.json GEÇERSİZ JSON", [(e as Error).message]);
}

const result = validateCurriculum(raw);
if (!result.ok) fail("Müfredat doğrulaması başarısız", result.errors);

const { data, questCount, objectiveCount } = result;
console.log(
  green(`✓ Müfredat geçerli`) +
    dim(`  — ${questCount} quest, ${objectiveCount} objective, ${data.chapters.length} bölüm`)
);

if (VALIDATE_ONLY) process.exit(0);

const publicJson = JSON.stringify(toPublic(data), null, 1);
const publicBundle = `/* ======================================================================
   AUTO-GENERATED from data/curriculum.json — DO NOT EDIT.
   Uret: npm run build

   Komut kontrolu TARAYICIDA yapilir (anlik geri bildirim), bu yuzden
   'expect' spec'leri ve 'success' ciktilari burada. 'hint' (dogru komutun
   metni) BURADA DEGIL — sunucudan istenir. Odulu de sunucu verir
   (supabase/functions/game).
   ====================================================================== */
const CQ_DATA = ${publicJson};
const CHAPTERS = CQ_DATA.chapters;
const TRACKS   = CQ_DATA.tracks;
const QUESTS   = CQ_DATA.quests;
const MODULES  = CQ_DATA.modules;
const SHOP     = CQ_DATA.shop;
const STORY    = CQ_DATA.story;
`;

// Sunucu bundle'ı: TAM müfredat (cevaplar dahil). Sadece Edge Function okur.
const secretBundle = JSON.stringify(data, null, 1) + "\n";

console.log("");
writeIfNeeded(PUBLIC_DST, publicBundle, "web/js/content.generated.js (public)");
writeIfNeeded(SECRET_DST, secretBundle, "supabase/functions/_shared/curriculum.json (secret)");
writeIfNeeded(join(ROOT, "web", "js", "parser.js"), browserParser(), "web/js/parser.js (uretilmis)");

/* Paylaşılan çekirdeği Edge Function klasörüne kopyala.
   Deno, supabase/functions dışındaki klasörleri bundle edemediği için
   parser/progression'ın bir kopyası orada durmak zorunda. Kaynak yine
   shared/ — kopya build ile üretilir, elle düzenlenmez, CI drift'i yakalar. */
for (const file of ["parser.ts", "progression.ts"]) {
  const src = readFileSync(join(ROOT, "shared", file), "utf8");
  const banner =
    `/* AUTO-COPIED from shared/${file} by scripts/build.ts — DO NOT EDIT.\n` +
    `   Deno (Edge Function) supabase/functions disi klasorleri bundle\n` +
    `   edemedigi icin paylasilan cekirdek buraya kopyalanir.\n` +
    `   Kaynagi duzenle: shared/${file}, sonra: npm run build */\n`;
  writeIfNeeded(
    join(ROOT, "supabase", "functions", "_shared", file),
    banner + src,
    `supabase/functions/_shared/${file} (kopya)`
  );
}

/* Son kontrol: public bundle'a kaza eseri cevap sızdı mı? */
for (const needle of ['"hint"']) {
  if (publicBundle.includes(needle)) {
    fail(`SIZINTI: public bundle ${needle} alanı içeriyor.`, [
      "scripts/build.ts içindeki publicQuest() bu alanı düşürmeli.",
    ]);
  }
}

/* Eğitim sayfaları: content/**.md -> web/ogren, web/komut, sitemap.xml
   Müfredatı parametre olarak alıyor çünkü ders sayfaları quest listesini
   ve "şimdi uygula" bağlantısını oradan çekiyor. */
console.log("");
const content = buildContent(data, { check: CHECK });
if (content.errors.length) fail("Eğitim içeriği doğrulaması başarısız", content.errors);
console.log(dim(`  — ${content.lessons.length} ders sayfası`));

console.log("");
console.log(green(CHECK ? "✓ Üretilen dosyalar güncel." : "✓ Build tamam."));
