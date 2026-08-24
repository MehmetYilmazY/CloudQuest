/* =========================================================================
   Parser testleri — "kullanıcı doğru yaptı ama oyun yanlış dedi" hatalarına
   karşı güvenlik ağı. Doğrulama artık sunucuda tek noktada olduğu için bu
   testler ürünün adalet garantisidir.
   Çalıştır: npm test
   ========================================================================= */
import { test } from "node:test";
import assert from "node:assert/strict";
import { match, tokenize, segments } from "./parser.ts";
import { validateCurriculum, allQuests } from "./curriculum.validate.ts";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------- tokenize */
test("tokenize: boşlukları böler, tırnakları tek token yapar", () => {
  assert.deepEqual(tokenize("echo hello world"), ["echo", "hello", "world"]);
  assert.deepEqual(tokenize('git commit -m "ilk commit"'), ["git", "commit", "-m", "ilk commit"]);
  assert.deepEqual(tokenize("echo 'tek tırnak da'"), ["echo", "tek tırnak da"]);
});

test("tokenize: baştaki sudo düşer", () => {
  assert.deepEqual(tokenize("sudo systemctl restart nginx"), ["systemctl", "restart", "nginx"]);
  assert.deepEqual(tokenize("SUDO ls"), ["ls"]);
  // sudo yalnızca BAŞTA düşer; argüman olarak geçen 'sudo' korunur
  assert.deepEqual(tokenize("echo sudo"), ["echo", "sudo"]);
});

test("segments: pipe / && / ; ayraçlarını böler", () => {
  assert.deepEqual(segments("ls | grep foo"), ["ls", "grep foo"]);
  assert.deepEqual(segments("cd logs && ls"), ["cd logs", "ls"]);
  assert.deepEqual(segments("pwd;ls"), ["pwd", "ls"]);
});

/* ---------------------------------------------------------------- match */
test("match: temel cmd eşleşmesi", () => {
  assert.equal(match("pwd", { cmd: ["pwd"] }), true);
  assert.equal(match("ls", { cmd: ["pwd"] }), false);
});

test("match: alternatif token ('a|b')", () => {
  assert.equal(match("ls", { cmd: ["ls|dir"] }), true);
  assert.equal(match("dir", { cmd: ["ls|dir"] }), true);
  assert.equal(match("tree", { cmd: ["ls|dir"] }), false);
});

test("match: need sırasızdır ve fazladan flag tolere edilir", () => {
  const spec = { cmd: ["chmod"], need: ["+x", String.raw`re:.+\.sh$`] };
  assert.equal(match("chmod +x deploy.sh", spec), true);
  assert.equal(match("chmod deploy.sh +x", spec), true, "sıra bağlayıcı olmamalı");
  assert.equal(match("chmod -v +x deploy.sh", spec), true, "fazladan flag düşürmemeli");
  assert.equal(match("chmod deploy.sh", spec), false, "eksik need geçmemeli");
});

test("match: need aynı token'ı iki kez tüketemez", () => {
  // İki ayrı dosya isteniyorsa tek dosya yetmemeli.
  const FILE = String.raw`re:^\w+\.txt$`;
  const spec = { cmd: ["cp"], need: [FILE, FILE] };
  assert.equal(match("cp a.txt", spec), false);
  assert.equal(match("cp a.txt b.txt", spec), true);
});

test("match: pipe içindeki herhangi bir segment eşleşirse geçer", () => {
  assert.equal(match("cat app.log | grep ERROR", { cmd: ["grep"], need: ["ERROR"] }), true);
  assert.equal(match("cat app.log | grep ERROR", { cmd: ["cat"], need: ["app.log"] }), true);
});

test("match: anyOf alternatif çözümleri kabul eder", () => {
  const spec = { anyOf: [{ cmd: ["git", "checkout"], need: ["-b"] }, { cmd: ["git", "switch"], need: ["-c"] }] };
  assert.equal(match("git checkout -b feature", spec), true);
  assert.equal(match("git switch -c feature", spec), true);
  assert.equal(match("git branch feature", spec), false);
});

test("match: expect yoksa hiçbir şey geçmez (fail-closed)", () => {
  assert.equal(match("pwd", null), false);
  assert.equal(match("pwd", undefined), false);
});

test("match: bozuk regex kullanıcıyı geçirmez, patlatmaz da", () => {
  assert.equal(match("herhangi", { cmd: ["re:["] }), false);
});

test("match: aşırı uzun girdi kesilir (DoS koruması)", () => {
  const huge = "x".repeat(50_000) + " pwd";
  assert.doesNotThrow(() => match(huge, { cmd: ["pwd"] }));
});

/* ----------------------------------------- gerçek müfredat üzerinde regresyon */
test("müfredat: her objective'in kendi hint'i kendi expect'ini geçer", () => {
  const raw = JSON.parse(readFileSync(join(ROOT, "data", "curriculum.json"), "utf8"));
  const res = validateCurriculum(raw);
  assert.equal(res.ok, true, res.ok ? "" : (res as { errors: string[] }).errors.join("\n"));
  if (!res.ok) return;

  const failures: string[] = [];
  for (const q of allQuests(res.data)) {
    q.objectives.forEach((o, i) => {
      if (!match(o.hint, o.expect)) {
        failures.push(`${q.id}[${i + 1}] hint="${o.hint}" kendi expect'ini geçmiyor`);
      }
    });
  }
  assert.deepEqual(failures, [], `\n${failures.join("\n")}`);
});

test("müfredat: boş girdi hiçbir objective'i geçmez", () => {
  const raw = JSON.parse(readFileSync(join(ROOT, "data", "curriculum.json"), "utf8"));
  const res = validateCurriculum(raw);
  if (!res.ok) return;
  const leaks: string[] = [];
  for (const q of allQuests(res.data)) {
    q.objectives.forEach((o, i) => {
      for (const junk of ["", "   ", "asdf", "help"]) {
        if (match(junk, o.expect)) leaks.push(`${q.id}[${i + 1}] "${junk}" ile geçiliyor`);
      }
    });
  }
  assert.deepEqual(leaks, [], `\n${leaks.join("\n")}`);
});

/* =========================================================================
   TARAYICI <-> SUNUCU PARİTESİ
   -------------------------------------------------------------------------
   Parser artık iki yerde çalışıyor: tarayıcıda anlık kontrol, sunucuda ödül
   verilirken son söz. İkisi farklı karar verirse oyuncu "oyun doğru dedi
   ama XP gelmedi" durumuna düşer — mümkün olan en kötü hata.

   web/js/parser.js bu dosyadan ÜRETİLİYOR (scripts/build.ts), ama üretim
   adımı bozulabilir. Bu test üretilen dosyayı gerçekten çalıştırıp aynı
   sonucu verdiğini doğruluyor.
   ========================================================================= */
test("parite: üretilen tarayıcı parser'ı sunucuyla aynı kararı verir", () => {
  const generated = readFileSync(join(ROOT, "web", "js", "parser.js"), "utf8");

  const ctx: { CQParser?: { match(raw: string, e: unknown): boolean } } = {};
  createContext(ctx);
  runInContext(generated, ctx);
  const browser = ctx.CQParser;
  assert.ok(browser && typeof browser.match === "function", "web/js/parser.js CQParser.match sunmalı");

  const raw = JSON.parse(readFileSync(join(ROOT, "data", "curriculum.json"), "utf8"));
  const res = validateCurriculum(raw);
  assert.equal(res.ok, true);
  if (!res.ok) return;

  // Her objective icin: dogru cevap, bos girdi ve birkac bozuk girdi.
  const probes = ["", "asdf", "help", "ls -la", "sudo rm -rf /"];
  const mismatches: string[] = [];

  for (const q of allQuests(res.data)) {
    q.objectives.forEach((o, i) => {
      for (const input of [o.hint, ...probes]) {
        const server = match(input, o.expect);
        const client = browser!.match(input, o.expect);
        if (server !== client) {
          mismatches.push(`${q.id}[${i + 1}] "${input}" → sunucu:${server} tarayıcı:${client}`);
        }
      }
    });
  }
  assert.deepEqual(mismatches, [], `\n${mismatches.join("\n")}`);
});
