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

/* --- yol haritası aşaması ----------------------------------------------- */
/**
 * /yol-haritasi/<slug> — programın bir aşaması (ay / hafta bloğu).
 *
 * Ders sayfası "konu nedir" der; aşama sayfası **"şimdi ne yapacağım"** der.
 * İkisi ayrı sayfa, çünkü ayrı soruyu cevaplıyorlar ve ayrı aranıyorlar:
 * "linux terminal öğrenme" bir konu aramasıdır, "cloud engineer yol haritası"
 * bir sıra ve takvim aramasıdır. Aynı sayfaya sıkıştırılırsa ikisi de yarım
 * cevap alır.
 *
 * Aşamanın hangi bölümleri kapsadığı burada YAZILMAZ — `track` üzerinden
 * curriculum.json'daki track'in `chapters` dizisinden okunur. Müfredat
 * değişirse aşama sayfası kendiliğinden uyar.
 */
export const StageLessonSchema = z
  .object({
    type: z.literal("stage"),
    /** Sıra: 0 = hazırlık, 1-6 = müfredat track'leri. İskeletle eşleşmeli. */
    stage: z.number().int().min(0).max(6),
    /** curriculum.json'daki track id'si. Hazırlık aşamasında yok. */
    track: z.string().optional(),
    /** Takvimdeki yeri — "Hafta 1-4" gibi. Yalnızca gösterim. */
    weeks: z.string().min(3).max(40),
    /** Haftalık hedef saat. Program gerçekçi dursun diye sayfada yazar. */
    hours: z.number().int().min(1).max(40).optional(),
    /** Hub satırında görünen "bunu bitirince ne yapabilirsin" cümlesi. */
    outcome: z.string().min(20).max(160),
    /** Aşamanın gerçek hayat projesi — okumakla bitmediğinin kanıtı. */
    project: z.string().min(20).max(200),
    ...BaseFrontmatter,
  })
  .strict();

export const LessonFrontmatterSchema = z.discriminatedUnion("type", [
  ChapterLessonSchema,
  CommandLessonSchema,
  StageLessonSchema,
]);

export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;
export type ChapterLesson = z.infer<typeof ChapterLessonSchema>;
export type CommandLesson = z.infer<typeof CommandLessonSchema>;
export type StageLesson = z.infer<typeof StageLessonSchema>;

/** Dosyadan okunmuş, gövdesiyle birlikte ders. */
export type Lesson = {
  frontmatter: LessonFrontmatter;
  body: string;          // ham markdown
  sourcePath: string;    // hata mesajlarında göstermek için
  slug: string;          // çözülmüş nihai slug
  url: string;           // "/ogren/terminal-ve-linux"
};

/** Ders türüne göre URL öneki. Tek yerde tanımlı; değişirse her yer uyar. */
export const URL_PREFIX = {
  chapter: "/ogren",
  command: "/komut",
  stage: "/yol-haritasi",
} as const;

export function lessonUrl(fm: LessonFrontmatter, slug: string): string {
  return `${URL_PREFIX[fm.type]}/${slug}`;
}

/** Slug çözümü: açıkça verilmişse o, yoksa komut adı / başlıktan türetilmiş. */
export function resolveSlug(fm: LessonFrontmatter): string {
  if (fm.slug) return fm.slug;
  if (fm.type === "command") return slugify(fm.command);
  return slugify(fm.title);
}

/* =========================================================================
   YOL HARİTASININ İSKELETİ
   -------------------------------------------------------------------------
   Aşamaların SIRASI ve KİMLİĞİ burada; içerikleri content/yol-haritasi/*.md.

   Neden ayrı bir liste var: hub sayfası henüz YAZILMAMIŞ aşamayı da "yakında"
   diye göstermek zorunda — yoksa okuyucu programın üç aşamadan oluştuğunu
   sanar. Bölüm hub'ı bu bilgiyi curriculum.chapters'tan alıyor; aşamaların
   karşılığı ise curriculum.tracks, artı müfredatta karşılığı OLMAYAN tek
   aşama: Hafta 0 (hazırlık — kurulum, hesaplar, çalışma ritmi).

   1-6 arası aşamalar track'lerle aynı sırada olmalı; üreteç bunu denetler.
   ========================================================================= */
export const ROADMAP_SPINE = [
  { n: 0, track: null, label: "Hazırlık" },
  { n: 1, track: "fundamentals", label: "Foundations" },
  { n: 2, track: "cloud-core", label: "Cloud Core" },
  { n: 3, track: "iac", label: "Infrastructure as Code" },
  { n: 4, track: "containers", label: "Containers" },
  { n: 5, track: "automation", label: "Otomasyon" },
  { n: 6, track: "mastery", label: "Ustalık" },
] as const;
