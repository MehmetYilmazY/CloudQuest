/* Yerel önizleme sunucusu — Vercel'in cleanUrls davranışını taklit eder.
   Yalnızca geliştirme içindir; dağıtımda Vercel servis ediyor.
   Kullanım: node scripts/serve.cjs  (http://localhost:4321) */
const http = require("node:http");
const fs = require("node:fs");
const p = require("node:path");

const ROOT = p.join(__dirname, "..", "web");
const PORT = Number(process.env.PORT || 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const base = p.join(ROOT, url);
  // cleanUrls: /komut/chmod -> chmod.html; dizin -> index.html
  for (const cand of [base, base + ".html", p.join(base, "index.html")]) {
    if (!cand.startsWith(ROOT)) continue;                 // dizin dışına çıkma
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      res.writeHead(200, { "Content-Type": TYPES[p.extname(cand)] || "application/octet-stream" });
      return res.end(fs.readFileSync(cand));
    }
  }
  const notFound = p.join(ROOT, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404");
}).listen(PORT, () => console.log(`web/ -> http://localhost:${PORT}`));
