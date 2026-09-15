/* =========================================================================
   CloudQuest — çeviri katmanı (i18n)
   -------------------------------------------------------------------------
   TEK KAYNAK hâlâ Türkçe: data/curriculum.json. İngilizce onun yanında
   ayrı bir dosyada yaşar:

     data/i18n/curriculum.en.json   { "<yol>": "<İngilizce metin>", ... }

   Neden ikinci bir curriculum.json değil de düz bir "yol -> metin" haritası:
   müfredatın YAPISI (id'ler, expect spec'leri, requires zinciri, xp/credit
   dengesi) tek yerde kalsın diye. İki tam kopya tutulsaydı biri diğerinden
   ayrışır ve "İngilizce oynayan başka bir oyun oynar" hâline gelirdi.
   Harita yalnızca METİN taşır; yapı Türkçe dosyadan gelir.

   Anahtarlar indeks değil ID tabanlıdır (`quests.c1q1.objectives.0.task`),
   böylece müfredatta sıra değişince çeviriler kaymaz.

   Kullanım:
     npm run i18n            eksik/bayat anahtarları raporla
     npm run i18n:sync       haritayı müfredatla eşitle (yeni anahtar ekle,
                             ölü anahtarı at, mevcut çeviriyi koru)
   ========================================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Curriculum } from "../shared/curriculum.schema.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Türkçe kaynaktır; burada saydığımız diller ONUN çevirileridir. */
export const SOURCE_LANG = "tr" as const;
export const TARGET_LANGS = ["en"] as const;
export const ALL_LANGS = [SOURCE_LANG, ...TARGET_LANGS] as const;
export type Lang = (typeof ALL_LANGS)[number];

export const curriculumMapPath = (lang: string) =>
  join(ROOT, "data", "i18n", `curriculum.${lang}.json`);
export const uiMapPath = (lang: string) => join(ROOT, "data", "i18n", `ui.${lang}.json`);

/* =========================================================================
   1) ÇIKARMA — müfredattaki çevrilebilir her metnin yolu
   -------------------------------------------------------------------------
   Bilerek DIŞARIDA bırakılanlar:
     • id, requires, expect, xp, credits, icon, status  → yapı/mekanik
     • hint                                            → kabuk komutunun
       kendisi; çevrilirse oyun çalışmaz
     • badge                                           → rozet adı zaten
       İngilizce ve oyuncunun kaydında saklanıyor; çevirmek eski kayıtları
       kırar
   ========================================================================= */
export type Entry = { key: string; value: string };

function questEntries(prefix: string, q: Curriculum["quests"][number]): Entry[] {
  const out: Entry[] = [{ key: `${prefix}.title`, value: q.title }];
  q.brief.forEach((v, i) => out.push({ key: `${prefix}.brief.${i}`, value: v }));
  q.objectives.forEach((o, i) => {
    out.push({ key: `${prefix}.objectives.${i}.task`, value: o.task });
    out.push({ key: `${prefix}.objectives.${i}.teach`, value: o.teach });
    out.push({ key: `${prefix}.objectives.${i}.success`, value: o.success });
  });
  q.complete.forEach((v, i) => out.push({ key: `${prefix}.complete.${i}`, value: v }));
  return out;
}

export function curriculumEntries(c: Curriculum): Entry[] {
  const out: Entry[] = [];

  c.chapters.forEach((ch) => {
    out.push({ key: `chapters.${ch.n}.title`, value: ch.title });
    out.push({ key: `chapters.${ch.n}.desc`, value: ch.desc });
  });

  c.tracks.forEach((t) => out.push({ key: `tracks.${t.id}.title`, value: t.title }));

  c.story.prologue.forEach((v, i) => out.push({ key: `story.prologue.${i}`, value: v }));
  for (const [id, act] of Object.entries(c.story.acts)) {
    out.push({ key: `story.acts.${id}.title`, value: act.title });
    act.intro.forEach((v, i) => out.push({ key: `story.acts.${id}.intro.${i}`, value: v }));
    act.outro.forEach((v, i) => out.push({ key: `story.acts.${id}.outro.${i}`, value: v }));
  }
  for (const [id, beat] of Object.entries(c.story.beats)) {
    out.push({ key: `story.beats.${id}.title`, value: beat.title });
    beat.lines.forEach((v, i) => out.push({ key: `story.beats.${id}.lines.${i}`, value: v }));
  }

  c.quests.forEach((q) => out.push(...questEntries(`quests.${q.id}`, q)));

  c.modules.forEach((m) => {
    out.push({ key: `modules.${m.id}.title`, value: m.title });
    out.push({ key: `modules.${m.id}.desc`, value: m.desc });
    m.topics.forEach((v, i) => out.push({ key: `modules.${m.id}.topics.${i}`, value: v }));
    m.quests.forEach((q) => out.push(...questEntries(`quests.${q.id}`, q)));
  });

  c.shop.forEach((s) => {
    out.push({ key: `shop.${s.id}.name`, value: s.name });
    out.push({ key: `shop.${s.id}.desc`, value: s.desc });
  });

  return out;
}

/* =========================================================================
   2) UYGULAMA — haritayı müfredatın üstüne giydir
   -------------------------------------------------------------------------
   Çevirisi olmayan anahtar Türkçe kalır. Yarı çevrilmiş bir müfredat, boş
   bir ekrandan iyidir: oyuncu takılmaz, eksik olan da gözle görülür.
   ========================================================================= */
export type LocaleMap = Record<string, string>;

export function readLocaleMap(path: string): LocaleMap {
  if (!existsSync(path)) return {};
  const raw = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  const out: LocaleMap = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith("_")) continue; // _meta gibi yorum alanları
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return out;
}

export function writeLocaleMap(path: string, map: LocaleMap, note: string): void {
  mkdirSync(dirname(path), { recursive: true });
  const body = { _note: note, ...map };
  writeFileSync(path, JSON.stringify(body, null, 2) + "\n", "utf8");
}

/** Yapıyı bozmadan metinleri değiştirir; kaynak nesne mutasyona uğramaz. */
export function localizeCurriculum(c: Curriculum, map: LocaleMap): Curriculum {
  if (!Object.keys(map).length) return c;
  const t = (key: string, fallback: string) => map[key] ?? fallback;

  const quest = (prefix: string, q: Curriculum["quests"][number]) => ({
    ...q,
    title: t(`${prefix}.title`, q.title),
    brief: q.brief.map((v, i) => t(`${prefix}.brief.${i}`, v)),
    objectives: q.objectives.map((o, i) => ({
      ...o,
      task: t(`${prefix}.objectives.${i}.task`, o.task),
      teach: t(`${prefix}.objectives.${i}.teach`, o.teach),
      success: t(`${prefix}.objectives.${i}.success`, o.success),
    })),
    complete: q.complete.map((v, i) => t(`${prefix}.complete.${i}`, v)),
  });

  return {
    ...c,
    chapters: c.chapters.map((ch) => ({
      ...ch,
      title: t(`chapters.${ch.n}.title`, ch.title),
      desc: t(`chapters.${ch.n}.desc`, ch.desc),
    })),
    tracks: c.tracks.map((tr) => ({ ...tr, title: t(`tracks.${tr.id}.title`, tr.title) })),
    story: {
      ...c.story,
      prologue: c.story.prologue.map((v, i) => t(`story.prologue.${i}`, v)),
      acts: Object.fromEntries(
        Object.entries(c.story.acts).map(([id, a]) => [
          id,
          {
            title: t(`story.acts.${id}.title`, a.title),
            intro: a.intro.map((v, i) => t(`story.acts.${id}.intro.${i}`, v)),
            outro: a.outro.map((v, i) => t(`story.acts.${id}.outro.${i}`, v)),
          },
        ])
      ),
      beats: Object.fromEntries(
        Object.entries(c.story.beats).map(([id, b]) => [
          id,
          {
            when: b.when,
            title: t(`story.beats.${id}.title`, b.title),
            lines: b.lines.map((v, i) => t(`story.beats.${id}.lines.${i}`, v)),
          },
        ])
      ),
    },
    quests: c.quests.map((q) => quest(`quests.${q.id}`, q)),
    modules: c.modules.map((m) => ({
      ...m,
      title: t(`modules.${m.id}.title`, m.title),
      desc: t(`modules.${m.id}.desc`, m.desc),
      topics: m.topics.map((v, i) => t(`modules.${m.id}.topics.${i}`, v)),
      quests: m.quests.map((q) => quest(`quests.${q.id}`, q)),
    })),
    shop: c.shop.map((s) => ({
      ...s,
      name: t(`shop.${s.id}.name`, s.name),
      desc: t(`shop.${s.id}.desc`, s.desc),
    })),
  };
}

/* =========================================================================
   3) KAPSAM RAPORU — neyin çevrilmediğini build/CI görebilsin
   ========================================================================= */
export type Coverage = { total: number; done: number; missing: string[]; stale: string[] };

export function coverage(entries: Entry[], map: LocaleMap): Coverage {
  const keys = new Set(entries.map((e) => e.key));
  const missing = entries.filter((e) => !map[e.key]).map((e) => e.key);
  const stale = Object.keys(map).filter((k) => !keys.has(k));
  return { total: entries.length, done: entries.length - missing.length, missing, stale };
}

/* =========================================================================
   CLI
   ========================================================================= */
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const { validateCurriculum } = await import("../shared/curriculum.validate.ts");
  const sync = process.argv.includes("--sync");

  const raw = JSON.parse(readFileSync(join(ROOT, "data", "curriculum.json"), "utf8"));
  const res = validateCurriculum(raw);
  if (!res.ok) {
    console.error("\x1b[31m✖ Müfredat geçersiz — önce onu düzelt.\x1b[0m");
    res.errors.forEach((e) => console.error("   • " + e));
    process.exit(1);
  }

  const entries = curriculumEntries(res.data);
  let failed = false;

  for (const lang of TARGET_LANGS) {
    const path = curriculumMapPath(lang);
    const map = readLocaleMap(path);
    const cov = coverage(entries, map);
    const pct = Math.round((cov.done / cov.total) * 100);

    console.log(`\ncurriculum.${lang}.json — ${cov.done}/${cov.total} (%${pct})`);
    if (cov.stale.length) console.log(`  ölü anahtar: ${cov.stale.length}`);
    if (cov.missing.length) {
      console.log(`  eksik: ${cov.missing.length}`);
      cov.missing.slice(0, 15).forEach((k) => console.log(`    · ${k}`));
      if (cov.missing.length > 15) console.log(`    … ve ${cov.missing.length - 15} tane daha`);
      failed = true;
    }

    if (sync) {
      const next: LocaleMap = {};
      for (const e of entries) next[e.key] = map[e.key] ?? "";
      writeLocaleMap(
        path,
        next,
        `CloudQuest ${lang.toUpperCase()} — anahtar: data/curriculum.json içindeki yol. ` +
          `Boş değer = çevrilmedi (oyunda Türkçe gösterilir). Eşitle: npm run i18n:sync`
      );
      console.log(`  ✓ eşitlendi: data/i18n/curriculum.${lang}.json`);
    }
  }

  // --sync bir bakım komutu: eksikleri yazmak onun işi, şikâyet etmek değil.
  process.exit(!sync && failed ? 1 : 0);
}
