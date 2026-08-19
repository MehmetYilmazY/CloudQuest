/* =========================================================================
   CloudQuest — curriculum.json şeması (Zod)
   -------------------------------------------------------------------------
   data/curriculum.json TEK KAYNAK. Bu dosya onun sözleşmesidir: build ve CI
   burada patlar, tarayıcıda değil. Yeni bir alan eklerken önce buraya ekle.

   Not: `expect` ve `hint` GİZLİ alanlardır (cevap anahtarı). Şema onları
   zorunlu tutar; public bundle'a girmemelerini scripts/build.ts sağlar.
   ========================================================================= */
import { z } from "zod";

/* --- komut eşleştirme spec'i (parser.ts ile birebir aynı sözleşme) ------- */
const MatcherSchema = z
  .string()
  .min(1, "eşleyici boş olamaz")
  .refine(
    (m) => {
      if (!m.startsWith("re:")) return true;
      try { new RegExp(m.slice(3)); return true; } catch { return false; }
    },
    { message: "geçersiz regex ('re:' önekinden sonrası derlenemiyor)" }
  );

const LeafExpectSchema = z
  .object({
    cmd: z.array(MatcherSchema).optional(),
    need: z.array(MatcherSchema).optional(),
  })
  .strict()
  .refine((e) => (e.cmd?.length ?? 0) > 0, {
    message: "expect.cmd en az bir token içermeli (yoksa her girdi eşleşir)",
  });

/** { cmd, need } veya { anyOf: [ {cmd,need}, ... ] } — tek seviye iç içe. */
export const ExpectSchema = z.union([
  LeafExpectSchema,
  z.object({ anyOf: z.array(LeafExpectSchema).min(1) }).strict(),
]);

/* --- quest ---------------------------------------------------------------*/
export const ObjectiveSchema = z
  .object({
    task: z.string().min(1),      // public: ne yapılacak
    teach: z.string().min(1),     // public: neden/nasıl
    expect: ExpectSchema,         // GİZLİ: doğrulama spec'i
    hint: z.string().min(1),      // GİZLİ: doğru komut
    success: z.string().min(1),   // public sonrası: doğru cevabın çıktısı
  })
  .strict();

export const QuestSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+$/, "id küçük harf + rakam olmalı"),
    chapter: z.number().int().min(1).max(8).optional(), // lab quest'lerinde yok
    title: z.string().min(1),
    requires: z.array(z.string()),
    xp: z.number().int().positive(),
    credits: z.number().int().nonnegative(),
    badge: z.string().optional(),
    brief: z.array(z.string()),
    objectives: z.array(ObjectiveSchema).min(1),
    complete: z.array(z.string()),
  })
  .strict();

/* --- diğer bölümler ------------------------------------------------------*/
export const ChapterSchema = z
  .object({ n: z.number().int().min(1), title: z.string().min(1), desc: z.string().min(1) })
  .strict();

export const TrackSchema = z
  .object({
    id: z.string().min(1),
    icon: z.string().min(1),
    title: z.string().min(1),
    chapters: z.array(z.number().int().min(1)).min(1),
  })
  .strict();

export const ModuleSchema = z
  .object({
    id: z.string().min(1),
    icon: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(["active", "soon"]),
    desc: z.string().min(1),
    topics: z.array(z.string()),
    quests: z.array(QuestSchema),
  })
  .strict();

export const ShopItemSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    icon: z.string().min(1),
    cost: z.number().int().positive(),
    desc: z.string().min(1),
    effect: z
      .object({
        xp: z.number().int().positive().optional(),
        badge: z.string().optional(),
        freeHints: z.number().int().positive().optional(),
      })
      .strict()
      .refine((e) => Object.keys(e).length > 0, { message: "effect boş olamaz" }),
  })
  .strict();

export const StorySchema = z
  .object({
    startup: z.string().min(1),
    prologue: z.array(z.string()),
    acts: z.record(
      z.string(),
      z.object({ title: z.string(), intro: z.array(z.string()), outro: z.array(z.string()) }).strict()
    ),
    beats: z.record(
      z.string(),
      z
        .object({
          when: z.enum(["intro", "complete"]),
          title: z.string(),
          lines: z.array(z.string()),
        })
        .strict()
    ),
  })
  .strict();

export const CurriculumSchema = z
  .object({
    _meta: z.object({ note: z.string(), expectFormat: z.string() }).strict(),
    chapters: z.array(ChapterSchema).min(1),
    tracks: z.array(TrackSchema).min(1),
    story: StorySchema,
    quests: z.array(QuestSchema).min(1),
    modules: z.array(ModuleSchema),
    shop: z.array(ShopItemSchema),
  })
  .strict();

export type Curriculum = z.infer<typeof CurriculumSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Expect = z.infer<typeof ExpectSchema>;
