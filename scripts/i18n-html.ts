/* =========================================================================
   CloudQuest — statik sayfaların İngilizce ikizi
   -------------------------------------------------------------------------
   Neden çalışma zamanı çevirisi YETMİYOR: web/js/i18n.js sayfayı tarayıcıda
   çeviriyor ve oyun için bu yeterli. Ama pazarlama sayfası bir ARAMA
   yüzeyi — tarayıcıda dönen JavaScript'e güvenip İngilizce içeriğin
   indekslenmesini ummak kırılgan bir bahis. Bu yüzden aynı işaretlenmiş
   HTML'den derleme anında gerçek bir `/en/...` dosyası üretiyoruz.

   TEK KAYNAK korunuyor: Türkçe sayfa tek yazılan dosya; İngilizcesi ondan
   ve data/i18n/ui.en.json'dan türetiliyor. İki HTML'i elle sürdürmek
   birinin diğerinden ayrışmasıyla biterdi.

   Dönüşüm, i18n.js'in tarayıcıda yaptığının aynısıdır:
     data-i18n        -> elemanın metni
     data-i18n-html   -> elemanın iç HTML'i
     data-i18n-attr   -> "öznitelik:anahtar; ..."
   Ek olarak: <html lang>, göreli bağlantılar ve hreflang düzeltilir.

   Ayrıştırıcı bilinçli olarak küçük: kendi yazdığımız, iyi biçimli HTML'i
   okuyor. Tam bir DOM bağımlılığı eklemek, tek yaptığı iş üç özniteliği
   uygulamak olan bir adım için fazla olurdu.
   ========================================================================= */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(ROOT, "web");

export type Strings = Record<string, string>;

/** Bir açılış etiketinin ilgili özniteliğini okur (tek/çift tırnak). */
function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "") : null;
}

/** `<foo ...>` ile eşleşen kapanışını bulur; iç içe aynı etiketleri sayar. */
function matchingClose(html: string, from: number, tagName: string): number {
  const open = new RegExp(`<${tagName}\\b`, "gi");
  const close = new RegExp(`</${tagName}\\s*>`, "gi");
  let depth = 1;
  let i = from;
  while (i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(html);
    const c = close.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) { depth++; i = o.index + o[0].length; continue; }
    depth--;
    if (depth === 0) return c.index;
    i = c.index + c[0].length;
  }
  return -1;
}

/** Void (kapanışsız) elemanlar: içerik değiştirilemez, yalnız öznitelik. */
const VOID = new Set(["meta", "link", "img", "input", "br", "hr", "source", "area", "base", "col", "embed", "track", "wbr"]);

/**
 * data-i18n* işaretli her elemanı verilen sözlükle çevirir.
 * Karşılığı olmayan anahtar sessizce atlanır: yarı çevrilmiş ama çalışan
 * bir sayfa, boş bir elemandan iyidir.
 */
export function translateHtml(html: string, strings: Strings): { html: string; missing: string[] } {
  const missing: string[] = [];
  const t = (key: string): string | null => {
    const v = strings[key];
    if (v == null) { missing.push(key); return null; }
    return v;
  };

  let out = "";
  let i = 0;
  const TAG = /<([a-zA-Z][\w-]*)\b[^>]*>/g;

  while (i < html.length) {
    TAG.lastIndex = i;
    const m = TAG.exec(html);
    if (!m) { out += html.slice(i); break; }

    const [tag, rawName] = m;
    const name = rawName.toLowerCase();
    out += html.slice(i, m.index);

    const keyText = attr(tag, "data-i18n");
    const keyHtml = attr(tag, "data-i18n-html");
    const keyAttr = attr(tag, "data-i18n-attr");

    let openTag = tag;
    if (keyAttr) {
      for (const pair of keyAttr.split(";")) {
        const bits = pair.split(":");
        if (bits.length !== 2) continue;
        const [an, ak] = [bits[0].trim(), bits[1].trim()];
        const value = t(ak);
        if (value == null) continue;
        const re = new RegExp(`(\\s${an}\\s*=\\s*)("([^"]*)"|'([^']*)')`, "i");
        openTag = re.test(openTag)
          ? openTag.replace(re, `$1"${value.replace(/"/g, "&quot;")}"`)
          : openTag.replace(/\s*\/?>$/, ` ${an}="${value.replace(/"/g, "&quot;")}"$&`);
      }
    }

    out += openTag;
    i = m.index + tag.length;

    // İçerik değiştirilecekse gövdeyi atla ve yerine çeviriyi koy.
    const key = keyHtml || keyText;
    if (key && !VOID.has(name) && !tag.endsWith("/>")) {
      const end = matchingClose(html, i, name);
      if (end !== -1) {
        const value = t(key);
        if (value != null) {
          out += keyHtml ? value : value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
          i = end;
        }
      }
    }
  }

  return { html: out, missing: [...new Set(missing)] };
}

/**
 * Sayfayı İngilizce sürümüne dönüştürür: çeviri + dil etiketi + hreflang.
 *
 * Bağlantılar `depth` kadar `../` ile düzeltilir; /en/ altındaki sayfa
 * kardeş dosyalara (app.html gibi) bir üst dizinden ulaşır. Kök-göreli
 * (/ogren) ve mutlak adresler olduğu gibi kalır — onlar zaten doğru yeri
 * gösteriyor.
 */
export function toEnglishPage(html: string, strings: Strings, opts: { path: string; site: string }): { html: string; missing: string[] } {
  const res = translateHtml(html, strings);
  let out = res.html;

  out = out.replace(/<html\s+lang="[^"]*"/i, '<html lang="en"');
  out = out.replace(/(<meta\s+property="og:locale"\s+content=")[^"]*"/i, '$1en_US"');

  // Göreli bağlantılar bir dizin yukarıyı göstermeli (web/en/... -> web/...).
  out = out.replace(/\b(href|src)="(?!https?:|\/\/|\/|#|data:|mailto:)([^"]+)"/gi, '$1="../$2"');

  const trUrl = opts.site + opts.path;
  const enUrl = opts.site + "/en" + (opts.path === "/" ? "/" : opts.path);
  const alternates =
    `\n  <link rel="canonical" href="${enUrl}" />` +
    `\n  <link rel="alternate" hreflang="tr" href="${trUrl}" />` +
    `\n  <link rel="alternate" hreflang="en" href="${enUrl}" />` +
    `\n  <link rel="alternate" hreflang="x-default" href="${trUrl}" />`;

  out = out.replace(/\s*<link rel="canonical"[^>]*>/i, "");
  out = out.replace(/<\/head>/i, alternates + "\n</head>");

  return { html: out, missing: res.missing };
}

/** Türkçe sayfaya, İngilizce ikizine işaret eden hreflang etiketlerini ekler. */
export function withAlternates(html: string, opts: { path: string; site: string }): string {
  if (/hreflang="en"/i.test(html)) return html;
  const trUrl = opts.site + opts.path;
  const enUrl = opts.site + "/en" + (opts.path === "/" ? "/" : opts.path);
  const tags =
    `\n  <link rel="alternate" hreflang="tr" href="${trUrl}" />` +
    `\n  <link rel="alternate" hreflang="en" href="${enUrl}" />` +
    `\n  <link rel="alternate" hreflang="x-default" href="${trUrl}" />`;
  return html.replace(/<\/head>/i, tags + "\n</head>");
}

/* ---------------------------------------------------------------- yazma */
export type HtmlPage = { src: string; out: string; path: string };

/** Hangi statik sayfanın İngilizce ikizi üretilecek. */
export const PAGES: HtmlPage[] = [
  { src: "index.html", out: "en/index.html", path: "/" },
  { src: "404.html", out: "en/404.html", path: "/404" },
];

export function buildEnglishPages(
  strings: Strings,
  site: string,
  write: (path: string, content: string, label: string) => void
): string[] {
  const missing: string[] = [];
  for (const page of PAGES) {
    const srcPath = join(WEB, page.src);
    if (!existsSync(srcPath)) continue;

    const raw = readFileSync(srcPath, "utf8");

    // Türkçe sayfa da kardeşini ilan etsin (hreflang çift yönlü olmalı).
    const trWithAlt = withAlternates(raw, { path: page.path, site });
    if (trWithAlt !== raw) write(srcPath, trWithAlt, `web/${page.src} (hreflang)`);

    const res = toEnglishPage(trWithAlt, strings, { path: page.path, site });
    missing.push(...res.missing);
    mkdirSync(dirname(join(WEB, page.out)), { recursive: true });
    write(join(WEB, page.out), res.html, `web/${page.out} (EN)`);
  }
  return [...new Set(missing)];
}
