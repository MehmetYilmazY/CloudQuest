/* =========================================================================
   CloudQuest — Eğitim içeriği şeması
   -------------------------------------------------------------------------
   İKİ AYRI TEK KAYNAK, bilerek:

     data/curriculum.json  -> OYUN. Quest, objective, cevap anahtarı.
     content/**.md         -> DERS. İnsan tarafından yazılan uzun metin.

   Neden ayrı? Çünkü farklı hızlarda değişiyorlar ve farklı kitleye gidiyorlar.
   Müfredat JSON'u makine tarafından okunacak veri; ders metni okunacak yazı.
   İkisini tek dosyaya tıkmak, 1550 satırlık JSON'un içine paragraf gömmek
   demekti — ne yazması ne gözden geçirmesi mümkün olurdu.

   Aralarındaki bağ ID üzerinden: bir ders sayfası `chapter: 3` der, üretici
   o bölümün quest'lerini curriculum.json'dan çeker ve iki tarafı birbirine
   linkler. Böylece müfredat değişince ders sayfası kendiliğinden güncellenir.

   ⚠ SIZINTI KURALI: ders metni bir quest'in `hint` değerini (yani cevabını)
   birebir içeremez. CI bunu denetler — bkz. scripts/content.ts.
   ========================================================================= */
import { z } from "zod";

/* Türkçe karakterleri URL'e uygun hale getirir. Sayfa adresleri Türkçe
   kalmalı ("terminal-ve-linux"), çünkü aranan kelime Türkçe. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("").map((ch) => map[ch] ?? ch).join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* --- ortak alanlar ------------------------------------------------------ */
const BaseFrontmatter = {
  /** URL parçası. Verilmezse başlıktan türetilir. */
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug sadece küçük harf, rakam ve tire").optional(),

  /** <title> ve h1. Aranan kelimeyi doğal biçimde içermeli. */
  title: z.string().min(8).max(70),

  /**
   * Meta description. Google 150-160 karakteri gösteriyor; alt sınır
   * "yeterince bilgi ver", üst sınır "kesilme".
   */
  description: z.string().min(70).max(165),

  /**
   * Bu sayfanın hedeflediği BİRİNCİL arama. Sayfa başına tek tane.
   * İki sayfa aynı sorguyu hedeflerse Google ikisini de zayıflatır
   * (keyword cannibalization) — CI bu tekrarı hata sayar.
   */
  targetQuery: z.string().min(3),

  /** İkincil sorgular; sayfa içinde geçmeli ama başlığı belirlemez. */
  alsoRanksFor: z.array(z.string()).default([]),

  /** Oyuna giden çağrı: bu dersi hangi quest'te uyguluyor? */
  practiceQuest: z.string().optional(),

  /** Son güncelleme (sitemap lastmod + sayfada "güncellendi" satırı). */
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-AA-GG biçiminde olmalı"),

  /** Taslak sayfalar üretilir ama noindex olur ve sitemap'e girmez. */
  draft: z.boolean().default(false),
};

/* --- bölüm dersi -------------------------------------------------------- */
/** /ogren/<slug> — bir müfredat bölümünün kavramsal anlatımı. */
export const ChapterLessonSchema = z
  .object({
    type: z.literal("chapter"),
    chapter: z.number().int().min(1).max(8),
    ...BaseFrontmatter,
  })
  .strict();

/* --- komut sayfası ------------------------------------------------------ */
/** /komut/<command> — tek bir komutun referans + öğretici sayfası. */
export const CommandLessonSchema = z
  .object({
    type: z.literal("command"),
    /** Komutun kendisi: "chmod", "kubectl". Slug bundan türer. */
    command: z.string().regex(/^[a-z0-9][a-z0-9._-]*$/, "geçerli bir komut adı olmalı"),
    /** Hangi bölümde öğretiliyor — sayfalar arası bağ buradan kurulur. */
    chapter: z.number().int().min(1).max(8).optional(),
    /** "Bunu da oku" bloğu için komşu komutlar. */
    relatedCommands: z.array(z.string()).default([]),
    ...BaseFrontmatter,
  })
  .strict();

export const LessonFrontmatterSchema = z.discriminatedUnion("type", [
  ChapterLessonSchema,
  CommandLessonSchema,
]);

export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;
export type ChapterLesson = z.infer<typeof ChapterLessonSchema>;
export type CommandLesson = z.infer<typeof CommandLessonSchema>;

/** Dosyadan okunmuş, gövdesiyle birlikte ders. */
export type Lesson = {
  frontmatter: LessonFrontmatter;
  body: string;          // ham markdown
  sourcePath: string;    // hata mesajlarında göstermek için
  slug: string;          // çözülmüş nihai slug
  url: string;           // "/ogren/terminal-ve-linux"
};

/** Ders türüne göre URL öneki. Tek yerde tanımlı; değişirse her yer uyar. */
export const URL_PREFIX = { chapter: "/ogren", command: "/komut" } as const;

export function lessonUrl(fm: LessonFrontmatter, slug: string): string {
  return `${URL_PREFIX[fm.type]}/${slug}`;
}

/** Slug çözümü: açıkça verilmişse o, yoksa komut adı / başlıktan türetilmiş. */
export function resolveSlug(fm: LessonFrontmatter): string {
  if (fm.slug) return fm.slug;
  if (fm.type === "command") return slugify(fm.command);
  return slugify(fm.title);
}
