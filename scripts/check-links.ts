/* =========================================================================
   CloudQuest — İç link denetçisi
   -------------------------------------------------------------------------
   "Sayfalar hiç 404'e düşmesin" tek seferlik bir kontrol değil, sürekli bir
   söz. Bu script web/ altındaki her HTML dosyasını tarar, her iç bağlantıyı
   gerçek dosya sistemine karşı çözer ve karşılığı olmayan varsa build'i kırar.

   Çözümleme Vercel'in kurallarını taklit eder:
     cleanUrls   -> /komut/chmod  ==  web/komut/chmod.html
     dizin       -> /ogren        ==  web/ogren/index.html
     redirects   -> vercel.json'daki source'lar geçerli sayılır

   Böylece bir ders sayfası silindiğinde ya da bir slug değiştiğinde, hatayı
   kullanıcı değil CI bulur.
   ========================================================================= */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(ROOT, "web");

const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

/** web/ altındaki bütün .html dosyaları. */
function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) htmlFiles(abs, out);
    else if (entry.endsWith(".html")) out.push(abs);
  }
  return out;
}

/** vercel.json'da tanımlı yönlendirme kaynakları — bunlar 404 değil. */
function redirectSources(): Set<string> {
  const cfg = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8")) as {
    redirects?: Array<{ source: string }>;
  };
  return new Set((cfg.redirects ?? []).map((r) => r.source));
}

/** Bir site-içi yolun karşılığı var mı? (cleanUrls + dizin indeksi dahil) */
function resolves(urlPath: string): boolean {
  if (urlPath === "/" || urlPath === "") return existsSync(join(WEB, "index.html"));
  const rel = urlPath.replace(/^\/+/, "");
  return (
    existsSync(join(WEB, rel)) ||
    existsSync(join(WEB, rel + ".html")) ||
    existsSync(join(WEB, rel, "index.html"))
  );
}

const EXTERNAL = /^(https?:|mailto:|tel:|data:|javascript:|#)/i;

const files = htmlFiles(WEB);
const redirects = redirectSources();
const broken: string[] = [];
let checked = 0;

for (const file of files) {
  const rel = file.slice(WEB.length + 1).replace(/\\/g, "/");
  const html = readFileSync(file, "utf8");

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (EXTERNAL.test(raw)) continue;

    // Göreli bağlantıyı sayfanın kendi konumuna göre mutlaklaştır.
    const abs = raw.startsWith("/")
      ? raw
      : "/" + posix.join(posix.dirname(rel) === "." ? "" : posix.dirname(rel), raw);

    const clean = abs.split("#")[0].split("?")[0];
    checked++;
    if (clean === "" || resolves(clean) || redirects.has(clean)) continue;

    broken.push(`${rel} → ${raw}`);
  }
}

if (broken.length) {
  console.error(red(`✖ ${broken.length} kırık iç bağlantı:`));
  broken.forEach((b) => console.error("   • " + b));
  console.error(dim("\n  Ya hedefi oluştur, ya bağlantıyı düzelt, ya da vercel.json'a yönlendirme ekle."));
  process.exit(1);
}

console.log(green("✓ Kırık iç bağlantı yok") + dim(`  — ${files.length} sayfa, ${checked} bağlantı`));
