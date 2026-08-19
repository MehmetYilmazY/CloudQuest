/* =========================================================================
   CloudQuest — Eğitim sayfası üreteci
   -------------------------------------------------------------------------
     content/ogren/*.md  ->  web/ogren/<slug>.html   (+ /ogren hub)
     content/komut/*.md  ->  web/komut/<slug>.html   (+ /komut hub)
                         ->  web/sitemap.xml         (elle yazılan yerine)

   TASARIM KARARI — neden statik HTML üretiyoruz:
   Katman 2'de site Next.js'e taşınacak. O zaman bu üreteç çöpe gidecek;
   ama İÇERİK gitmeyecek. Markdown + frontmatter taşınabilir bir formattır,
   Next.js de aynı dosyaları okur. Yani atılacak olan ~250 satır kod, kalan
   ise onlarca sayfalık yazı. Bilinçli bir takas: içeriği bugün yazmaya
   başlamak, framework kararını beklemekten daha değerli.

   SIZINTI KURALI: bir ders sayfası, yönlendirdiği quest'in cevabını
   veremez ve genel olarak bir "çözüm listesi"ne dönüşemez. Ayrıntı ve
   gerekçe aşağıda auditLessons() içinde — kural bilinçli olarak mutlak
   değil, ölçülü.
   ========================================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import {
  LessonFrontmatterSchema, lessonUrl, resolveSlug,
  type Lesson, type LessonFrontmatter,
} from "../shared/content.schema.ts";
import { validateCurriculum, allQuests } from "../shared/curriculum.validate.ts";
import type { Curriculum, Quest } from "../shared/curriculum.schema.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const WEB = join(ROOT, "web");

/* ⚠ ALAN ADINI DEĞİŞTİR — canonical, OG ve sitemap bunu kullanır. */
export const SITE = "https://cloudquest.vercel.app";

const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

export type ContentResult = { lessons: Lesson[]; written: number; errors: string[] };

/* =========================================================================
   1) OKUMA — frontmatter ayrıştırma
   Tam bir YAML ayrıştırıcı yerine ihtiyacımız olan alt küme: skaler
   alanlar ve "- " ile başlayan diziler. Bağımlılık eklemeye değmez;
   şema zaten her alanı doğruluyor.
   ========================================================================= */
function parseFrontmatter(raw: string, path: string): { data: Record<string, unknown>; body: string } {
  if (!raw.startsWith("---")) throw new Error(`${path}: frontmatter yok (--- ile başlamalı)`);
  const end = raw.indexOf("\n---", 3);
  if (end === -1) throw new Error(`${path}: frontmatter kapanmamış`);

  const head = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");

  const data: Record<string, unknown> = {};
  let currentKey: string | null = null;

  for (const line of head.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && currentKey) {
      (data[currentKey] as string[]).push(unquote(item[1]));
      continue;
    }

    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) throw new Error(`${path}: frontmatter satırı anlaşılmadı -> ${line}`);
    const [, key, rawValue] = kv;
    const value = rawValue.trim();

    if (value === "") { data[key] = []; currentKey = key; continue; }
    currentKey = null;

    if (value === "true") data[key] = true;
    else if (value === "false") data[key] = false;
    else if (/^-?\d+$/.test(value)) data[key] = Number(value);
    else data[key] = unquote(value);
  }
  return { data, body };
}
const unquote = (s: string) => s.replace(/^["'](.*)["']$/, "$1").trim();

function readLessons(): { lessons: Lesson[]; errors: string[] } {
  const lessons: Lesson[] = [];
  const errors: string[] = [];
  if (!existsSync(CONTENT)) return { lessons, errors };

  for (const dir of ["ogren", "komut"]) {
    const abs = join(CONTENT, dir);
    if (!existsSync(abs)) continue;

    for (const file of readdirSync(abs).filter((f) => f.endsWith(".md"))) {
      const sourcePath = `content/${dir}/${file}`;
      try {
        const { data, body } = parseFrontmatter(readFileSync(join(abs, file), "utf8"), sourcePath);
        const parsed = LessonFrontmatterSchema.safeParse(data);
        if (!parsed.success) {
          parsed.error.issues.forEach((i) =>
            errors.push(`${sourcePath} → ${i.path.join(".") || "(kök)"}: ${i.message}`)
          );
          continue;
        }
        const fm = parsed.data;
        const expectedDir = fm.type === "chapter" ? "ogren" : "komut";
        if (dir !== expectedDir) {
          errors.push(`${sourcePath}: type="${fm.type}" olan dosya content/${expectedDir}/ altında olmalı`);
          continue;
        }
        if (body.trim().length < 400) {
          // İnce içerik SEO'da ceza sebebi; tohum metinden sayfa üretmeyi engeller.
          errors.push(`${sourcePath}: gövde çok kısa (${body.trim().length} karakter, en az 400 gerekli)`);
          continue;
        }
        const slug = resolveSlug(fm);
        lessons.push({ frontmatter: fm, body, sourcePath, slug, url: lessonUrl(fm, slug) });
      } catch (e) {
        errors.push(`${sourcePath}: ${(e as Error).message}`);
      }
    }
  }
  return { lessons, errors };
}

/* =========================================================================
   2) DENETİM — sayfalar birbirini yemesin, cevap sızmasın
   ========================================================================= */
function auditLessons(
  lessons: Lesson[], curriculum: Curriculum, warnings: string[]
): string[] {
  const errors: string[] = [];
  const quests = allQuests(curriculum);
  const questIds = new Set(quests.map((q) => q.id));

  const seenUrl = new Map<string, string>();
  const seenQuery = new Map<string, string>();

  for (const l of lessons) {
    const fm = l.frontmatter;

    if (seenUrl.has(l.url)) {
      errors.push(`URL çakışması ${l.url}: ${seenUrl.get(l.url)} ve ${l.sourcePath}`);
    }
    seenUrl.set(l.url, l.sourcePath);

    // Aynı sorguyu hedefleyen iki sayfa birbirinin sıralamasını düşürür.
    const q = fm.targetQuery.toLowerCase().trim();
    if (seenQuery.has(q)) {
      errors.push(
        `targetQuery tekrarı "${fm.targetQuery}": ${seenQuery.get(q)} ve ${l.sourcePath} ` +
        `— aynı aramayı hedefleyen iki sayfa birbirini zayıflatır`
      );
    }
    seenQuery.set(q, l.sourcePath);

    if (fm.practiceQuest && !questIds.has(fm.practiceQuest)) {
      errors.push(`${l.sourcePath}: practiceQuest "${fm.practiceQuest}" diye bir quest yok`);
    }

    /* --- CEVAP SIZINTISI ------------------------------------------------
       Kural neyi koruyor? Ders sayfaları herkese açık; oyun ise cevabı
       tarayıcıdan sakladığımız için değerli. Bir ders sayfası cevap
       anahtarına dönüşürse Katman 1'de kapattığımız kapı yandan açılır.

       Ama kuralı "hiçbir komut dizisi geçemez" diye kurarsak sayfa
       yazılamaz hale gelir: `chmod` sayfası `chmod +x deploy.sh`
       yazamayacaksa o sayfanın var olma sebebi kalmaz — üstelik o dizi
       internetteki her Linux eğitiminde geçiyor, sır değil.

       Bu yüzden ölçülü davranıyoruz:
         HATA   — sayfanın KENDİ yönlendirdiği quest'in cevabını veriyorsa
                  (okuyucuyu gönderdiğin görevin çözümünü eline tutuşturmak)
         HATA   — 3'ten fazla farklı quest cevabı içeriyorsa
                  (sayfa artık ders değil, çözüm listesi)
         UYARI  — tek tük denk gelmeler: genel bilgi, geçer.
    --------------------------------------------------------------------- */
    const hits: Array<{ quest: string; step: number; answer: string }> = [];
    for (const quest of quests) {
      for (const [idx, obj] of quest.objectives.entries()) {
        const answer = obj.hint.trim();
        if (answer.length < 12) continue;         // "pwd" gibi kısa komutlar genel bilgi
        if (l.body.includes(answer)) hits.push({ quest: quest.id, step: idx + 1, answer });
      }
    }

    const ownQuest = fm.practiceQuest;
    for (const h of hits) {
      if (ownQuest && h.quest === ownQuest) {
        errors.push(
          `${l.sourcePath}: yönlendirdiği quest'in (${h.quest}[${h.step}]) cevabını veriyor ` +
          `("${h.answer}") — okuyucuyu gönderdiğin görevin çözümü sayfada olamaz`
        );
      }
    }
    if (hits.length > 3) {
      errors.push(
        `${l.sourcePath}: ${hits.length} farklı quest cevabı içeriyor ` +
        `(${hits.slice(0, 4).map((h) => h.quest).join(", ")}…) — bu ders değil, çözüm listesi`
      );
    } else if (hits.length) {
      warnings.push(
        `${l.sourcePath}: ${hits.length} quest cevabıyla örtüşüyor ` +
        `(${hits.map((h) => h.quest).join(", ")}) — genel bilgi olduğundan geçildi`
      );
    }
  }
  return errors;
}

/* =========================================================================
   3) ÜRETİM — HTML
   ========================================================================= */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type PageOptions = {
  title: string; description: string; url: string; body: string;
  breadcrumb: Array<{ name: string; url: string }>;
  jsonLd?: unknown; noindex?: boolean; updated?: string;
};

function page(o: PageOptions): string {
  const graph: unknown[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: o.breadcrumb.map((b, i) => ({
        "@type": "ListItem", position: i + 1, name: b.name, item: SITE + b.url,
      })),
    },
  ];
  if (o.jsonLd) graph.push(o.jsonLd);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(o.title)} — CloudQuest</title>
  <meta name="description" content="${esc(o.description)}" />
  <link rel="canonical" href="${SITE}${o.url}" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#06070a" />
  <meta name="robots" content="${o.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:site_name" content="CloudQuest" />
  <meta property="og:url" content="${SITE}${o.url}" />
  <meta property="og:title" content="${esc(o.title)}" />
  <meta property="og:description" content="${esc(o.description)}" />
  <meta property="og:image" content="${SITE}/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E%E2%98%81%EF%B8%8F%3C/text%3E%3C/svg%3E" />
  <link rel="stylesheet" href="/css/landing.css" />
  <link rel="stylesheet" href="/css/lesson.css" />
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
</head>
<body>
  <a class="skip-link" href="#main">İçeriğe geç</a>
  <canvas id="stars" aria-hidden="true"></canvas>
  <div class="nebula" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <header class="nav" id="nav">
    <nav class="nav-inner" aria-label="Ana menü">
      <a class="nav-logo" href="/">☁ CLOUDQUEST</a>
      <div class="nav-links">
        <a href="/ogren">Öğren</a>
        <a href="/komut">Komutlar</a>
        <a href="/#mufredat">Müfredat</a>
        <a href="/#sss">SSS</a>
      </div>
      <a class="btn btn-primary btn-sm" href="/app">Giriş yap</a>
    </nav>
  </header>

  <nav class="crumbs" aria-label="Konum">
    <div class="wrap">
      ${o.breadcrumb.map((b, i) =>
        i === o.breadcrumb.length - 1
          ? `<span aria-current="page">${esc(b.name)}</span>`
          : `<a href="${b.url}">${esc(b.name)}</a><span class="crumb-sep">/</span>`
      ).join("")}
    </div>
  </nav>

  <main id="main">
${o.body}
  </main>

  <footer class="footer">
    <div class="wrap footer-inner">
      <span>☁ CloudQuest${o.updated ? ` · güncellendi ${o.updated}` : ""}</span>
      <nav class="footer-links" aria-label="Alt menü">
        <a href="/ogren">Öğren</a>
        <a href="/komut">Komutlar</a>
        <a href="/app">Giriş yap</a>
        <a href="/">Ana sayfa</a>
      </nav>
    </div>
  </footer>
  <script src="/js/stars.js"></script>
  <script src="/js/landing.js"></script>
</body>
</html>
`;
}

/** Dersin sonundaki oyuna çağrı. Ders okumakla iş bitmiyor — asıl yer terminal. */
function practiceCta(fm: LessonFrontmatter, quest: Quest | null): string {
  if (!quest) {
    return `<aside class="practice">
        <p class="practice-k">Sıradaki adım</p>
        <h2>Okumakla olmuyor.</h2>
        <p>Bu komutları bir senaryo içinde, kendi ellerinle yaz.</p>
        <a class="btn btn-primary" href="/app">Terminale gir — ücretsiz</a>
      </aside>`;
  }
  return `<aside class="practice">
        <p class="practice-k">Şimdi uygula</p>
        <h2>${esc(quest.title)}</h2>
        <p>Bu dersteki komutları ${quest.objectives.length} adımlık bir görevde,
           mentör eşliğinde sen yazıyorsun. Takılırsan doğrusu gösteriliyor.</p>
        <a class="btn btn-primary" href="/app">Quest'i aç — ücretsiz</a>
      </aside>`;
}

function renderChapterPage(l: Lesson, c: Curriculum, byId: Map<string, Quest>): string {
  const fm = l.frontmatter as Extract<LessonFrontmatter, { type: "chapter" }>;
  const chapter = c.chapters.find((ch) => ch.n === fm.chapter);
  const quests = c.quests.filter((q) => q.chapter === fm.chapter);

  // Bölümün quest'leri müfredattan geliyor: içerik değişince sayfa da değişir.
  const questList = quests.length
    ? `<section class="lesson-quests">
        <h2>Bu bölümün görevleri</h2>
        <p class="lesson-quests-note">${quests.length} quest ·
           ${quests.reduce((n, q) => n + q.objectives.length, 0)} uygulamalı adım</p>
        <ol class="qlist">
          ${quests.map((q) => `<li><b>${esc(q.title)}</b><span>${q.objectives.length} adım</span></li>`).join("\n          ")}
        </ol>
      </section>`
    : "";

  return `    <article class="lesson">
      <div class="wrap">
        <p class="lesson-kicker">Bölüm ${fm.chapter}${chapter ? ` · ${esc(chapter.title)}` : ""}</p>
        <h1>${esc(fm.title)}</h1>
        <p class="lesson-standfirst">${esc(fm.description)}</p>
        <div class="prose">
${marked.parse(l.body, { async: false })}
        </div>
${questList}
${practiceCta(fm, fm.practiceQuest ? byId.get(fm.practiceQuest) ?? null : null)}
      </div>
    </article>`;
}

function renderCommandPage(l: Lesson, byId: Map<string, Quest>, allLessons: Lesson[]): string {
  const fm = l.frontmatter as Extract<LessonFrontmatter, { type: "command" }>;

  // "Bunu da oku": yalnızca GERÇEKTEN var olan sayfalara link ver.
  // Var olmayan sayfaya link vermek hem kullanıcıyı hem taramayı bozar.
  const related = fm.relatedCommands
    .map((cmd) => allLessons.find((x) => x.frontmatter.type === "command" && x.slug === cmd))
    .filter((x): x is Lesson => !!x);

  const relatedBlock = related.length
    ? `<section class="lesson-related">
        <h2>İlgili komutlar</h2>
        <div class="rel-row">
          ${related.map((r) => `<a class="rel-chip" href="${r.url}">${esc((r.frontmatter as { command: string }).command)}</a>`).join("\n          ")}
        </div>
      </section>`
    : "";

  return `    <article class="lesson">
      <div class="wrap">
        <p class="lesson-kicker">Komut referansı</p>
        <h1><code class="cmd-name">${esc(fm.command)}</code></h1>
        <p class="lesson-standfirst">${esc(fm.description)}</p>
        <div class="prose">
${marked.parse(l.body, { async: false })}
        </div>
${relatedBlock}
${practiceCta(fm, fm.practiceQuest ? byId.get(fm.practiceQuest) ?? null : null)}
      </div>
    </article>`;
}

function renderHub(kind: "chapter" | "command", lessons: Lesson[], c: Curriculum): string {
  const mine = lessons.filter((l) => l.frontmatter.type === kind && !l.frontmatter.draft);

  if (kind === "chapter") {
    const rows = c.chapters.map((ch) => {
      const l = mine.find((x) => (x.frontmatter as { chapter: number }).chapter === ch.n);
      const title = esc(ch.title);
      return l
        ? `<a class="hub-row" href="${l.url}"><span class="hub-n">${String(ch.n).padStart(2, "0")}</span>
             <span class="hub-t">${title}</span><span class="hub-d">${esc(ch.desc)}</span></a>`
        : `<div class="hub-row is-soon"><span class="hub-n">${String(ch.n).padStart(2, "0")}</span>
             <span class="hub-t">${title}</span><span class="hub-d">yakında</span></div>`;
    }).join("\n        ");

    return `    <section class="hub">
      <div class="wrap">
        <p class="lesson-kicker">Öğren</p>
        <h1>Cloud Engineering dersleri</h1>
        <p class="lesson-standfirst">Sekiz bölüm, sırayla. Önce ne olduğunu anla, sonra terminalde uygula.</p>
        ${rows}
      </div>
    </section>`;
  }

  const rows = mine
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((l) => `<a class="hub-row" href="${l.url}">
             <span class="hub-t"><code>${esc((l.frontmatter as { command: string }).command)}</code></span>
             <span class="hub-d">${esc(l.frontmatter.description.split(/[.?]/)[0])}</span></a>`)
    .join("\n        ");

  return `    <section class="hub">
      <div class="wrap">
        <p class="lesson-kicker">Komutlar</p>
        <h1>Komut sözlüğü</h1>
        <p class="lesson-standfirst">Müfredatta geçen komutların ne işe yaradığı, ne zaman kullanıldığı ve en sık yapılan hatalar.</p>
        ${rows || '<p class="lesson-standfirst">Henüz komut sayfası yok.</p>'}
      </div>
    </section>`;
}

/* =========================================================================
   4) SITEMAP
   ========================================================================= */
function buildSitemap(lessons: Lesson[]): string {
  const today = lessons.map((l) => l.frontmatter.updated).sort().pop() ?? "2026-01-01";
  const urls: Array<{ loc: string; pri: string; mod?: string }> = [
    { loc: "/", pri: "1.0", mod: today },
    { loc: "/ogren", pri: "0.9", mod: today },
    { loc: "/komut", pri: "0.9", mod: today },
    { loc: "/tutorial", pri: "0.6" },
    { loc: "/quiz", pri: "0.6" },
  ];
  for (const l of lessons) {
    if (l.frontmatter.draft) continue;      // taslaklar sitemap'e girmez
    urls.push({ loc: l.url, pri: "0.8", mod: l.frontmatter.updated });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- AUTO-GENERATED by scripts/content.ts — elle düzenleme, npm run build çalıştır. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>${u.mod ? `\n    <lastmod>${u.mod}</lastmod>` : ""}
    <priority>${u.pri}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

/* =========================================================================
   5) GİRİŞ NOKTASI
   ========================================================================= */
function write(path: string, content: string, check: boolean, label: string, log: string[]): boolean {
  const existing = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (existing === content) return false;
  if (check) throw new Error(`${label} güncel değil — \`npm run build\` çalıştırıp commit'le.`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  log.push(label);
  return true;
}

export function buildContent(curriculum: Curriculum, opts: { check?: boolean } = {}): ContentResult {
  const { lessons, errors: readErrors } = readLessons();
  const warnings: string[] = [];
  const errors = [...readErrors, ...auditLessons(lessons, curriculum, warnings)];
  for (const w of warnings) console.log(dim(`  ! ${w}`));
  if (errors.length) return { lessons, written: 0, errors };

  const byId = new Map(allQuests(curriculum).map((q) => [q.id, q]));
  const log: string[] = [];

  for (const l of lessons) {
    const fm = l.frontmatter;
    const isChapter = fm.type === "chapter";
    const body = isChapter ? renderChapterPage(l, curriculum, byId) : renderCommandPage(l, byId, lessons);

    const html = page({
      title: fm.title,
      description: fm.description,
      url: l.url,
      body,
      noindex: fm.draft,
      updated: fm.updated,
      breadcrumb: [
        { name: "CloudQuest", url: "/" },
        isChapter ? { name: "Öğren", url: "/ogren" } : { name: "Komutlar", url: "/komut" },
        { name: isChapter ? fm.title : (fm as { command: string }).command, url: l.url },
      ],
      jsonLd: {
        "@type": isChapter ? "LearningResource" : "TechArticle",
        headline: fm.title,
        description: fm.description,
        inLanguage: "tr-TR",
        dateModified: fm.updated,
        url: SITE + l.url,
        ...(isChapter ? { learningResourceType: "Lesson", educationalLevel: "Beginner" } : {}),
        publisher: { "@type": "Organization", name: "CloudQuest", url: SITE },
      },
    });

    write(join(WEB, l.url.slice(1) + ".html"), html, !!opts.check, `web${l.url}.html`, log);
  }

  for (const kind of ["chapter", "command"] as const) {
    const url = kind === "chapter" ? "/ogren" : "/komut";
    const html = page({
      title: kind === "chapter" ? "Cloud Engineering dersleri" : "Komut sözlüğü",
      description: kind === "chapter"
        ? "Linux'tan Kubernetes'e, sekiz bölümlük Türkçe Cloud Engineering ders serisi. Her bölümün sonunda terminalde uygulama."
        : "Bulut mühendisliğinde en çok kullanılan komutların Türkçe referansı: ne işe yarar, ne zaman kullanılır, en sık yapılan hatalar.",
      url,
      body: renderHub(kind, lessons, curriculum),
      breadcrumb: [
        { name: "CloudQuest", url: "/" },
        { name: kind === "chapter" ? "Öğren" : "Komutlar", url },
      ],
      jsonLd: { "@type": "CollectionPage", inLanguage: "tr-TR", url: SITE + url },
    });
    write(join(WEB, url.slice(1), "index.html"), html, !!opts.check, `web${url}/index.html`, log);
  }

  write(join(WEB, "sitemap.xml"), buildSitemap(lessons), !!opts.check, "web/sitemap.xml", log);

  for (const line of log) console.log(green(`  ✓ ${line}`));
  if (!log.length) console.log(dim("  = eğitim sayfaları (değişiklik yok)"));

  return { lessons, written: log.length, errors: [] };
}

/* Doğrudan çalıştırılırsa (npm run content) tek başına da iş görür. */
if (process.argv[1] && basename(process.argv[1]) === "content.ts") {
  const result = validateCurriculum(JSON.parse(readFileSync(join(ROOT, "data", "curriculum.json"), "utf8")));
  if (!result.ok) {
    console.error(red("✖ Müfredat geçersiz; önce onu düzelt.")); process.exit(1);
  }
  const out = buildContent(result.data, { check: process.argv.includes("--check") });
  if (out.errors.length) {
    console.error(red("✖ İçerik doğrulaması başarısız"));
    out.errors.forEach((e) => console.error("   • " + e));
    process.exit(1);
  }
  console.log(green(`✓ ${out.lessons.length} ders sayfası hazır.`));
}
