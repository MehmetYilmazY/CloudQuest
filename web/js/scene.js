/* =========================================================================
   CloudQuest — SAHNE PANELİ  (terminalin sağındaki görsel bağlam kutusu)
   -------------------------------------------------------------------------
   Amaç: yazdığın komut kafada canlansın. "cd logs" yazınca yolun değiştiğini,
   "mkdir release" yazınca klasörün doğduğunu, "aws ec2 run-instances" yazınca
   sunucunun ayağa kalktığını GÖRÜRSÜN.

   İki sahne biçimi var:
     • fs   → gerçek bir dosya ağacı + bulunduğun yol (cd/ls/mkdir/cp/rm işler)
     • pano → ikonlu kaynak listesi (ağ, git, AWS, terraform, docker/k8s, ci, gözlem)

   ÖNEMLİ: burası sadece GÖRSELDİR. Doğru/yanlış kararını CQParser verir; bu
   dosyadaki hiçbir şey quest ilerlemesini, XP'yi veya krediyi etkilemez.
   Komut ham hâliyle tokenize edilip yorumlanır (parser'ın expect spec'i değil).
   ========================================================================= */
var CQScene = (function () {
  "use strict";

  var box  = null;                  // panel kökü (#scene)
  var el   = {};                    // kalıcı iç kutular (aria-live bozulmasın)
  var S    = null;                  // aktif sahne durumu
  var head = { title: "", step: 0, total: 0, task: "" };
  var pathHit = false;              // yol satırı bu turda parladı mı

  /* =======================================================================
     Küçük yardımcılar
     ======================================================================= */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function tok(raw) {
    if (typeof CQParser !== "undefined") return CQParser.tokenize(raw);
    return String(raw).trim().split(/\s+/).filter(function (x) { return x; });
  }
  // "--user-name app-bot" ya da "--user-name=app-bot" → "app-bot"
  function flag(t, name) {
    for (var i = 0; i < t.length; i++) {
      if (t[i] === name) return t[i + 1] || "";
      if (t[i].indexOf(name + "=") === 0) return t[i].slice(name.length + 1);
    }
    return "";
  }
  function plain(t) {   // flag olmayan argümanlar (komutun kendisi hariç)
    return t.slice(1).filter(function (x) { return x.charAt(0) !== "-"; });
  }
  function tail(s, sep) {                       // arn/policy adının son parçası
    var p = String(s).split(sep || "/");
    return p[p.length - 1] || String(s);
  }
  function cut(s, n) {
    s = String(s || "");
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  /* =======================================================================
     Dosya ağacı düğümleri
     ======================================================================= */
  function dir(n, ch, o) {
    var d = { n: n, d: true, ch: ch || [] };
    if (o) for (var k in o) d[k] = o[k];
    return d;
  }
  function file(n, o) {
    var f = { n: n, d: false };
    if (o) for (var k in o) f[k] = o[k];
    return f;
  }
  function it(key, icon, label, meta, state) {
    return { key: key, icon: icon, label: label, meta: meta || "", state: state || "off" };
  }

  function fileIcon(f) {
    var n = f.n.toLowerCase();
    if (f.x) return "⚡";
    if (/\.log$/.test(n))            return "🪵";
    if (/\.md$/.test(n))             return "📘";
    if (/\.(ya?ml|conf|cfg|ini)$/.test(n)) return "⚙️";
    if (/\.sh$/.test(n))             return "📜";
    if (/\.(jar|zip|tar|gz|whl)$/.test(n)) return "📦";
    if (/\.(tmp|bak|old)$/.test(n))  return "🧹";
    if (/\.(tf|tfvars|tfstate)$/.test(n)) return "🌍";
    if (/^dockerfile$/.test(n))      return "🐳";
    if (/\.(json|tf?json)$/.test(n)) return "🧾";
    return "📄";
  }

  /* ---- yol çözümleme (cwd'ye göre; ".." ve "~" desteklenir) ---- */
  function segsOf(str) {
    var s = String(str || "");
    var cur = S.cwd.slice();
    if (s.charAt(0) === "~" || s.charAt(0) === "/") { cur = [S.root.n]; s = s.replace(/^[~/]+/, ""); }
    s.split("/").forEach(function (p) {
      if (!p || p === ".") return;
      if (p === "..") { if (cur.length > 1) cur.pop(); return; }
      cur.push(p);
    });
    return cur;
  }
  function nodeAt(segs) {
    var n = S.root;
    for (var i = 1; i < segs.length; i++) {
      if (!n.ch) return null;
      var next = null;
      for (var j = 0; j < n.ch.length; j++) if (n.ch[j].n === segs[i]) { next = n.ch[j]; break; }
      if (!next) return null;
      n = next;
    }
    return n;
  }
  function parentOf(segs) { return nodeAt(segs.slice(0, -1)); }
  function openTo(segs) {
    for (var i = 1; i <= segs.length; i++) {
      var n = nodeAt(segs.slice(0, i));
      if (n && n.d) n.open = true;
    }
  }
  function ensureDir(segs) {                     // eksik klasörleri yarat (mkdir -p)
    var n = S.root;
    for (var i = 1; i < segs.length; i++) {
      var next = null;
      for (var j = 0; j < n.ch.length; j++) if (n.ch[j].n === segs[i]) { next = n.ch[j]; break; }
      if (!next) { next = dir(segs[i], [], { fresh: true, open: true }); n.ch.push(next); }
      next.open = true;
      n = next;
    }
    return n;
  }
  function pathStr(segs) {
    segs = segs || S.cwd;
    return segs.join("/").replace(/^~/, "~");
  }
  function fullPath() {
    return "/home/engineer" + (S.cwd.length > 1 ? "/" + S.cwd.slice(1).join("/") : "");
  }
  function hitTree(node) {                       // ağacın tamamını parlat (find/grep -r)
    node.hit = true;
    (node.ch || []).forEach(hitTree);
  }
  function sortDirFirst(a, b) {
    if (!!a.d !== !!b.d) return a.d ? -1 : 1;
    return a.n.localeCompare(b.n);
  }

  /* ---- pano yardımcıları ---- */
  function item(key) {
    if (!S.groups) return null;
    for (var g = 0; g < S.groups.length; g++) {
      var its = S.groups[g].items;
      for (var i = 0; i < its.length; i++) if (its[i].key === key) return its[i];
    }
    return null;
  }
  function set(key, state, meta) {               // düğümü güncelle + parlat
    var i = item(key);
    if (!i) return null;
    if (state) i.state = state;
    if (meta != null && meta !== "") i.meta = meta;
    i.hit = true;
    return i;
  }
  function hit(key) { var i = item(key); if (i) i.hit = true; return i; }
  function group(label) {
    if (!S.groups) return null;
    for (var g = 0; g < S.groups.length; g++) if (S.groups[g].label === label) return S.groups[g];
    return null;
  }
  function add(label, node) {                    // panoya yeni satır ekle (varsa güncelle)
    var g = group(label);
    if (!g) { g = { label: label, items: [] }; (S.groups = S.groups || []).push(g); }
    var ex = item(node.key);
    if (ex) { ex.state = node.state; ex.meta = node.meta; ex.hit = true; return ex; }
    node.fresh = true; node.hit = true;
    g.items.push(node);
    return node;
  }

  /* =======================================================================
     SAHNELER
     ======================================================================= */
  // Meridian prod sunucusu — Bölüm 1'in dosya/sistem dünyası
  function fsScene() {
    return {
      kind: "fs", host: "meridian-prod", icon: "🖥️", ctx: "ssh · prod sunucusu",
      cwd: ["~"],
      root: dir("~", [
        dir("deploy", [file("app.jar"), file("old.tmp"), file("build.log")]),
        dir("logs",   [file("app.log"), file("error.log"), file("access.log")]),
        file("deploy.sh"), file("config.yml"), file("README.md")
      ], { open: true }),
      groups: [{
        label: "SİSTEM", items: [
          it("proc",  "🧠", "java", "pid 4711 · çalışıyor", "on"),
          it("nginx", "⚙️", "nginx", "durdu", "off"),
          it("pkg",   "📦", "htop", "kurulu değil", "off"),
          it("disk",  "💾", "disk /", "—", "idle")
        ]
      }]
    };
  }

  // Ağ zinciri — Bölüm 2 (paket nasıl akar, sunucuya nasıl bağlanılır)
  function netScene() {
    return {
      kind: "net", host: "engineer@laptop", icon: "💻", ctx: "özel ağ · 10.0.0.0/16",
      groups: [
        { label: "AĞ ZİNCİRİ", chain: true, items: [
          it("you", "💻", "laptop",       "10.0.9.31", "on"),
          it("dns", "🌐", "DNS",          "api.internal → ?", "off"),
          it("api", "🖥️", "api.internal", "bilinmiyor", "off"),
          it("db",  "🗄️", "db.internal",  "mysql · 3306", "off")
        ] },
        { label: "AÇIK PORTLAR", items: [] }
      ]
    };
  }

  // Git deposu — dallar ve commit'ler
  function gitScene() {
    var s = {
      kind: "git", host: "team/infra", icon: "🐙", ctx: "dal: —",
      branches: [{ name: "main", commits: 3, cur: true, pushed: true }],
      groups: [
        { label: "DEPO",          items: [it("repo", "🐙", "team/infra", "klonlanmadı", "off")] },
        { label: "DALLAR",        items: [] },
        { label: "ÇALIŞMA ALANI", items: [it("wt", "📝", "değişiklik", "yok", "idle")] }
      ]
    };
    return s;
  }
  function syncBranches() {
    var g = group("DALLAR");
    if (!g) return;
    var old = {};
    g.items.forEach(function (i) { old[i.key] = i; });
    g.items = S.branches.map(function (b) {
      var key = "b:" + b.name;
      var dots = "●".repeat(Math.min(b.commits, 8)) + (b.pushed ? " ☁" : " ·");
      var node = it(key, b.cur ? "➤" : "🌿", b.name, dots, b.cur ? "on" : "idle");
      if (old[key]) { node.hit = old[key].hit; } else { node.fresh = true; }
      return node;
    });
  }
  function curBranch() {
    return S.branches.filter(function (b) { return b.cur; })[0] || S.branches[0];
  }

  // AWS çekirdeği — Bölüm 3
  function cloudScene() {
    return {
      kind: "cloud", host: "AWS", icon: "☁️", ctx: "eu-central-1 · hesap 1111",
      groups: [
        { label: "KİMLİK (IAM)", items: [
          it("iam.cfg",  "🔑", "aws cli",  "anahtar yok", "off"),
          it("iam.user", "👤", "kullanıcı", "yok", "off"),
          it("iam.pol",  "📜", "policy",   "bağlı değil", "off"),
          it("iam.role", "🎭", "rol",      "yok", "off")
        ] },
        { label: "AĞ", items: [
          it("vpc",    "🕸️", "VPC",    "yok", "off"),
          it("subnet", "🔀", "subnet", "yok", "off"),
          it("igw",    "🚪", "internet gw", "yok", "off"),
          it("sg",     "🛡️", "security group", "yok", "off")
        ] },
        { label: "SUNUCU", items: [
          it("key", "🗝️", "key pair", "yok", "off"),
          it("ec2", "🖥️", "EC2",      "kapalı", "off"),
          it("eip", "📡", "elastic IP", "yok", "off")
        ] },
        { label: "VERİ", items: [
          it("s3",  "🪣", "S3 bucket", "yok", "off"),
          it("rds", "🗄️", "RDS",       "yok", "off")
        ] }
      ]
    };
  }

  // Güvenlik & maliyet — Bölüm 8 (yine aws, ama başka gözle)
  function secScene() {
    return {
      kind: "sec", host: "AWS · güvenlik", icon: "🔒", ctx: "least privilege denetimi",
      groups: [
        { label: "KİMLİK", items: [
          it("iam.pol",  "📜", "app-bot policy", "denetlenmedi", "off"),
          it("secret",   "🔐", "secret", "şifre kodda", "warn")
        ] },
        { label: "VERİ KORUMA", items: [
          it("s3.public", "🚧", "public erişim", "açık olabilir", "warn"),
          it("s3.enc",    "🔒", "şifreleme",     "yok", "off"),
          it("scan",      "🧪", "imaj taraması", "yapılmadı", "off")
        ] },
        { label: "DENETİM", items: [it("trail", "🧭", "CloudTrail", "kapalı", "off")] },
        { label: "MALİYET", items: [
          it("cost",   "💸", "maliyet raporu", "bilinmiyor", "off"),
          it("budget", "🎯", "bütçe alarmı",   "yok", "off"),
          it("tags",   "🏷️", "etiketler",      "eksik", "off"),
          it("idle",   "🛑", "boşta kaynak",   "para yakıyor", "warn")
        ] }
      ]
    };
  }

  // Terraform — Bölüm 4
  function iacScene() {
    return {
      kind: "iac", host: "infra/", icon: "🌍", ctx: "workspace: default",
      groups: [
        { label: "KOD", items: [
          it("f.main",  "🌍", "main.tf",           "kaynak tanımları", "on"),
          it("f.var",   "🌍", "variables.tf",      "değişkenler", "on"),
          it("f.state", "🧭", "terraform.tfstate", "yok", "off")
        ] },
        { label: "AKIŞ", chain: true, items: [
          it("s.init",  "⬇️", "init",     "sağlayıcı indirilmedi", "off"),
          it("s.val",   "✅", "validate", "—", "off"),
          it("s.plan",  "📋", "plan",     "—", "off"),
          it("s.apply", "🚀", "apply",    "—", "off")
        ] },
        { label: "YÖNETİLEN KAYNAK", items: [] }
      ]
    };
  }

  // Docker + Kubernetes — Bölüm 5
  function shipScene() {
    return {
      kind: "ship", host: "myapp", icon: "🐳", ctx: "docker + k8s",
      groups: [
        { label: "İMAJ", chain: true, items: [
          it("dockerfile", "🐳", "Dockerfile", "hazır", "on"),
          it("img",        "📦", "imaj",       "derlenmedi", "off"),
          it("reg",        "☁️", "registry",   "gönderilmedi", "off")
        ] },
        { label: "KONTEYNER", items: [
          it("cont", "🚢", "container", "çalışmıyor", "off"),
          it("vol",  "💾", "volume",    "yok", "off")
        ] },
        { label: "KUBERNETES", items: [
          it("nodes", "🧩", "node",           "bilinmiyor", "off"),
          it("dep",   "🚀", "deployment/web", "yok", "off"),
          it("pods",  "🟢", "pod",            "0 replika", "off"),
          it("svc",   "🌐", "service",        "yok", "off")
        ] }
      ]
    };
  }

  // CI/CD hattı — Bölüm 6
  function ciScene() {
    return {
      kind: "ci", host: "github/meridian", icon: "🔁", ctx: "branch: main",
      groups: [
        { label: "DEPO", items: [
          it("wf",     "📄", ".github/workflows", "yok", "off"),
          it("secret", "🔐", "AWS_DEPLOY_KEY",    "tanımsız", "off")
        ] },
        { label: "PIPELINE", chain: true, items: [
          it("p.build",  "🏗️", "build",   "—", "off"),
          it("p.test",   "🧪", "test",    "—", "off"),
          it("p.push",   "⬆️", "push",    "—", "off"),
          it("p.deploy", "🚀", "deploy",  "—", "off")
        ] }
      ]
    };
  }

  // Gözlemlenebilirlik — Bölüm 7
  function obsScene() {
    return {
      kind: "obs", host: "meridian-prod", icon: "📈", ctx: "log · metrik · trace",
      groups: [
        { label: "SİNYALLER", items: [
          it("log",   "🪵", "log akışı", "sessiz", "off"),
          it("met",   "📈", "metrik",    "—", "off"),
          it("trace", "🧵", "trace",     "—", "off")
        ] },
        { label: "ARAÇLAR", items: [
          it("prom",  "🔥", "prometheus:9090", "kapalı", "off"),
          it("graf",  "📊", "grafana:3000",    "kapalı", "off"),
          it("alert", "🚨", "alerts.yml",      "doğrulanmadı", "off")
        ] },
        { label: "SAĞLIK", items: [it("health", "❤️", "/health", "bilinmiyor", "off")] }
      ]
    };
  }

  // Menü (quest dışı) — yolculuğun bütünü
  var CH_ICON = { 1: "🖥️", 2: "🌐", 3: "☁️", 4: "🌍", 5: "🐳", 6: "🔁", 7: "📈", 8: "🔒" };
  function hubScene(stats) {
    return {
      kind: "hub", host: "Meridian", icon: "🏢", ctx: "altyapı durumu",
      groups: [{
        label: "MERIDIAN ALTYAPISI",
        items: (stats || []).map(function (c) {
          return it("ch" + c.n, CH_ICON[c.n] || "▫️", cut(c.title, 18),
                    c.done + "/" + c.total + " quest",
                    c.total && c.done === c.total ? "on" : (c.done > 0 ? "run" : "off"));
        })
      }]
    };
  }

  /* Sahne seçimi: bölüm numarası → sahne. Bölüm 2 iki dünyaya bakar
     (ağ + git), o yüzden quest bazında ince ayar var. Lab quest'leri
     (chapter yok) komutlarından tahmin edilir. */
  var BY_QUEST   = { c2q3: "git", c2q4: "git" };
  var BY_CHAPTER = { 1: "fs", 2: "net", 3: "cloud", 4: "iac", 5: "ship", 6: "ci", 7: "obs", 8: "sec" };
  var BUILD = {
    fs: fsScene, net: netScene, git: gitScene, cloud: cloudScene,
    iac: iacScene, ship: shipScene, ci: ciScene, obs: obsScene, sec: secScene
  };
  function guessKind(q) {
    var votes = {};
    (q.objectives || []).forEach(function (o) {
      // `verb` = objective'in komut fiili (build.ts hint'ten türetir).
      // hint'in kendisi artık sunucuda; sahne için tek kelime yeterli.
      var v = String(o.verb || "").toLowerCase();
      var k = v === "git" || v === "gh" ? "git"
            : v === "aws" ? "cloud"
            : v === "terraform" ? "iac"
            : v === "docker" || v === "kubectl" ? "ship"
            : /^(ping|curl|ssh|scp|dig|nslookup|host|traceroute|mtr|tracepath|ss|netstat|nmap|lsof|nc|tcpdump|tshark|openssl|iptables|ufw|ip)$/.test(v) ? "net"
            : "fs";
      votes[k] = (votes[k] || 0) + 1;
    });
    var best = "fs";
    for (var k in votes) if (votes[k] > (votes[best] || 0)) best = k;
    return best;
  }

  /* Sahneyi değiştirmeyen ama açıklanmaya değer komutlar (çoğu Advanced Lab).
     Panoya dokunmazlar; sadece "bu komut ne yapar" satırını yazarlar. */
  var EXPLAIN = {
    nmap:      ["🛰️ Port taraması", "Hangi portlar açık? Saldırgan da aynı komutu çalıştırır — sen önce çalıştır."],
    lsof:      ["🔎 Portu kim tutuyor?", "'Address already in use' hatasının cevabı bu komuttan çıkar."],
    nc:        ["🔌 Ham bağlantı denemesi", "Tek bir portun açık olup olmadığını söyler; curl'den bir kat daha alt seviye."],
    tcpdump:   ["🕵️ Paket yakalama", "Trafiği ham hâliyle görürsün: el sıkışma oldu mu, nerede koptu?"],
    tshark:    ["🧪 Yakalanan trafiği çözümle", "pcap dosyasını okunabilir hâle getirir."],
    openssl:   ["🔐 TLS el sıkışması", "Sertifikayı kim vermiş, ne zaman bitiyor, zincir tam mı?"],
    iptables:  ["🧱 Güvenlik duvarı kuralları", "Paketi kim düşürüyor? Kuralların sırası sonucu değiştirir."],
    ufw:       ["🧱 Güvenlik duvarı", "Port açarken 'kime açıyorum' sorusunu atlama."],
    ip:        ["🗺️ Yönlendirme tablosu", "Paket hangi arayüzden, hangi geçitten çıkıyor?"],
    echo:      ["💬 Ekrana yaz", "Script'in içini görmenin en basit yolu. $? = son komutun çıkış kodu (0 = başarı)."],
    awk:       ["✂️ Kolon ayıkla", "Log satırından sadece istediğin alanı çeker."],
    sed:       ["🔁 Bul & değiştir", "Akışın içinde düzenler; dosyayı editörde açmana gerek kalmaz."],
    sort:      ["📊 Sırala ve say", "sort | uniq -c | sort -rn = 'en çok tekrar eden ne?' kalıbı."],
    uniq:      ["📊 Tekrarları say", "Aynı satır kaç kere geçmiş?"],
    crontab:   ["⏰ Zamanlanmış görev", "Yedek script'i her gece kendi kendine çalışır."],
    ansible:   ["🤖 Ajansız otomasyon", "Tek komutla onlarca sunucuya aynı işi yaptırır — SSH yeter."],
    "ansible-playbook": ["📕 Playbook çalıştı", "Sunucunun 'olması gereken hâli' YAML'da yazar; Ansible o hâle getirir."],
    "ansible-galaxy":   ["📦 Hazır rol", "Rolleri indirir; tekerleği yeniden icat etmezsin."],
    "ansible-vault":    ["🔐 Şifreli değişkenler", "Sırlar depoda şifreli durur, parolasız okunmaz."],
    helm:      ["⎈ Helm chart", "Kubernetes uygulamalarının paket yöneticisi."],
    tfsec:     ["🧪 IaC güvenlik taraması", "Terraform kodundaki riskli ayarı buluta gitmeden yakalar."],
    set:       ["🛡️ Güvenli kabuk modu", "set -euo pipefail: hatada script sessizce devam etmez, durur."],
    "for":     ["🔁 Döngü", "Aynı işi listedeki her öğe için tekrarlar — otomasyonun temel taşı."],
    "while":   ["🔁 Koşullu döngü", "Koşul doğru olduğu sürece tekrar eder; satır satır dosya okumanın yolu."],
    "if":      ["🔀 Koşul", "'Dosya var mı, servis ayakta mı?' — karar veren script böyle yazılır."]
  };

  /* =======================================================================
     KOMUT YORUMLAMA  →  [başlık, açıklama]
     ======================================================================= */
  /* quiet = menü modu: tanınmayan komuta "doğru komut" demeyelim (oyun
     "bilinmeyen komut" diyorken sahne tersini söylemesin). */
  function apply(raw, quiet) {
    if (!S || !box) return;
    var t = tok(raw);
    if (!t.length) return;
    var v = t[0].toLowerCase(), a = plain(t), n = null;

    if (/^\.\//.test(v)) n = runScript(v.slice(2));
    else switch (v) {
      /* ---- dosya sistemi ---- */
      case "pwd":   n = doPwd(); break;
      case "ls": case "dir": case "ll": n = doLs(t, a); break;
      case "cd":    n = doCd(a[0] || "~"); break;
      case "cat": case "less": case "more": case "head": n = doRead(a, v); break;
      case "tail":  n = doRead(a, t.indexOf("-f") !== -1 ? "follow" : "tail"); break;
      case "grep": case "rg": n = doGrep(a); break;
      case "find":  n = doFind(t); break;
      case "wc":    n = doCount(a); break;
      case "mkdir": n = doMkdir(a); break;
      case "touch": n = doTouch(a); break;
      case "cp": case "mv": n = doMove(a, v === "mv"); break;
      case "rm":    n = doRm(a); break;
      case "chmod": n = doChmod(t, a); break;
      case "sh": case "bash": n = runScript(a[0] || "script"); break;

      /* ---- sistem / süreç ---- */
      case "ps": case "top": case "htop": n = doPs(); break;
      case "kill": case "pkill": n = doKill(a[0]); break;
      case "df": case "du": n = doDisk(); break;
      case "apt": case "apt-get": case "yum": case "dnf": n = doPkg(a); break;
      case "systemctl": case "service": n = doService(a); break;
      case "export": case "env": n = doEnv(t); break;

      /* ---- ağ ---- */
      case "ping": n = doPing(a[0]); break;
      case "nslookup": case "dig": case "host": n = doDns(a[0]); break;
      case "curl": case "wget": n = doCurl(t); break;
      case "traceroute": case "tracepath": case "mtr": n = doTrace(a[0]); break;
      case "ss": case "netstat": n = doPorts(); break;
      case "ssh": n = doSsh(a[0]); break;
      case "scp": case "rsync": n = doScp(a); break;

      /* ---- alan araçları ---- */
      case "git": n = doGit(t, a); break;
      case "gh":  n = doGh(t, a); break;
      case "aws": n = doAws(t); break;
      case "terraform": case "tf": n = doTf(t, a); break;
      case "docker": n = doDocker(t, a); break;
      case "kubectl": case "k": n = doKubectl(t, a); break;
      case "npm": case "yarn": case "pnpm": n = doNpm(a); break;
      case "promtool": n = [set("alert", "on", "kurallar geçerli") && "🚨 alerts.yml doğrulandı",
                            "Alarm kuralları hatalıysa gece yarısı kimse uyanmaz — bu yüzden test edilir."]; break;
      case "trivy": n = [set("scan", "on", "imaj tarandı") && "🧪 İmaj güvenlik taraması bitti",
                         "Bilinen zafiyetler (CVE) listelendi. Konteyner güvenliği burada başlar."]; break;

      /* ---- oyun menüsü komutları (hub sahnesi) ---- */
      case "quests": n = ["📜 Görev günlüğü", "Sırayla git: her quest bir öncekinin üstüne biner."]; break;
      case "map":    n = ["🗺️ Harita", "Soldaki kutu Meridian'ın altyapısı — yeşilleri sen kurdun."]; break;
      case "labs": case "lab": n = ["🔮 Advanced Labs", "Hikâyeden sonra uzmanlık modülleri."]; break;
      case "shop":   n = ["🛒 Dükkân", "Kredi biriktir, ipucu hakkı al."]; break;
      case "status": case "me": case "profile": n = ["👤 Karakter", "İlerlemen HUD'da ve profil sayfasında."]; break;
      default: break;
    }

    // Tanımadığım komutta bile eski açıklama ekranda kalmasın: en azından ne
    // olduğunu söyle (yanlış bilgi vermekten iyisi dürüst bir satır).
    if (!n) n = EXPLAIN[v] || (quiet ? null : ["✔ " + v + " çalıştı", "Doğru komut — bu adımın sahnede görsel bir karşılığı yok."]);
    if (n) note(raw, n[0], n[1]);
    render();
  }

  /* ---------------- dosya sistemi işleri ---------------- */
  function needFs() { return !!(S && S.root); }

  function doPwd() {
    if (!needFs()) return ["📍 pwd", "\"Neredeyim?\" — kabuk bulunduğun klasörün tam yolunu yazar."];
    pathHit = true;
    return ["📍 " + fullPath(), "\"Neredeyim?\" — kabuk sana tam yolu söyler. Kaybolunca ilk komut budur."];
  }
  function doLs(t, a) {
    if (!needFs()) return ["📂 Liste", "Bulunduğun yerde ne var — her şeyden önce bunu sor."];
    var segs = a.length ? segsOf(a[0]) : S.cwd;
    var node = nodeAt(segs);
    if (!node || !node.d) return ["📂 Liste", "Bu sahnede öyle bir klasör yok — ama komut doğru."];
    node.open = true; openTo(segs);
    node.ch.forEach(function (c) { c.hit = true; });
    var det = t.indexOf("-l") !== -1 || t.indexOf("-la") !== -1 || t.indexOf("-al") !== -1;
    return ["📂 " + pathStr(segs) + " → " + node.ch.length + " öğe",
            det ? "-l uzun liste: izinler, sahip, boyut, tarih. Sağdaki ağaçta içerik açıldı."
                : "Klasörün içi sağda açıldı. Klasörler önce, dosyalar sonra."];
  }
  function doCd(arg) {
    if (!needFs()) return ["📁 cd", "Klasör değiştirme komutu — dosya sahnesinde yolu değiştirir."];
    var segs = segsOf(arg);
    var node = nodeAt(segs);
    if (!node || !node.d) return ["🚫 " + arg + " bulunamadı",
                                  "Olmayan klasöre girilemez. 'ls' ile ne olduğuna bak, sonra tekrar dene."];
    S.cwd = segs; openTo(segs); node.hit = true; pathHit = true;
    return ["📁 " + pathStr(segs) + " içindesin",
            arg === ".." ? "'..' bir üst klasör demek — merdivende bir basamak yukarı."
                         : "Yol değişti: yukarıdaki 📍 satırı artık burayı gösteriyor."];
  }
  function doRead(a, how) {
    if (!needFs()) {                               // pano sahnesinde: log akışı canlanır
      if (how === "follow" && item("log")) {
        set("log", "on", "canlı akıyor");
        return ["🪵 Log akışı açıldı", "tail -f dosyaya düşen her yeni satırı anında ekrana verir. Canlı hata avı böyle yapılır."];
      }
      return ["📖 " + (a[a.length - 1] || "dosya") + " okundu", "Dosyanın içine bakmak: log'da cevap genelde son satırlardadır."];
    }
    var name = a[a.length - 1];
    var segs = segsOf(name || "");
    var node = name ? nodeAt(segs) : null;
    if (node) { node.hit = true; node.read = true; openTo(segs.slice(0, -1)); }
    var txt = how === "follow" ? "Akış canlı: dosyaya yeni satır düştükçe ekrana damlar. Ctrl+C ile çıkarsın."
            : how === "tail"   ? "Log dosyaları uzundur; hata genelde SONDA olur. Bu yüzden tail."
            : "Dosyanın içeriğini okudun — sağda 👁 işareti okuduğun dosyaları gösterir.";
    return ["📖 " + (name || "dosya") + " okundu", txt];
  }
  function doGrep(a) {
    var pat = a[0] || "?", fileName = a[1] || "";
    if (needFs()) {
      var node = fileName ? nodeAt(segsOf(fileName)) : null;
      if (node) node.hit = true; else if (S.root) hitTree(S.root);
    }
    return ["🔍 '" + cut(pat, 18) + "' aranıyor" + (fileName ? " → " + fileName : ""),
            "grep = binlerce satır arasından sadece işine yarayanı süzer. Aramanın kalbi."];
  }
  function doFind(t) {
    if (needFs() && S.root) hitTree(S.root);
    var name = flag(t, "-name") || flag(t, "-iname");
    return ["🔎 Ağaç taranıyor" + (name ? " · " + name : ""),
            "find bütün alt klasörlere iner. 'Bu dosya nerede?' sorusunun cevabı."];
  }
  function doCount(a) {
    var name = a[a.length - 1] || "";
    if (needFs() && name) { var nd = nodeAt(segsOf(name)); if (nd) nd.hit = true; }
    return ["🔢 Sayım" + (name ? " · " + name : ""), "wc -l satır sayar: 'kaç kere oldu?' sorusuna sayı ile cevap."];
  }
  function doMkdir(a) {
    if (!needFs()) {                               // pano sahnesinde: bilinen klasörler satırı açar
      var p = a.join(" ");
      if (/\.github/.test(p) && item("wf")) {
        set("wf", "on", "klasör hazır");
        return ["📁 .github/workflows oluştu", "GitHub bu klasördeki YAML dosyalarını otomatik pipeline olarak çalıştırır."];
      }
      return ["📁 " + (a[0] || "klasör") + " oluştu", "-p ara klasörleri de yaratır: tek komutla derin yol kurulur."];
    }
    var made = [];
    a.forEach(function (p) {
      var segs = segsOf(p);
      if (nodeAt(segs)) return;
      ensureDir(segs); openTo(segs); made.push(pathStr(segs));
    });
    if (!made.length) return ["📁 Zaten var", "Aynı isimde klasör varsa mkdir yeni bir şey yapmaz."];
    return ["📁 " + made.join(", ") + " oluştu", "Sağdaki ağaçta yeni klasör belirdi — düzen böyle kurulur."];
  }
  function doTouch(a) {
    if (!needFs()) return ["📄 Dosya", "Boş dosya oluşturma komutu."];
    var made = [];
    a.forEach(function (p) {
      var segs = segsOf(p);
      if (nodeAt(segs)) return;
      var par = ensureDir(segs.slice(0, -1));
      par.ch.push(file(segs[segs.length - 1], { fresh: true, hit: true }));
      par.open = true; made.push(segs[segs.length - 1]);
    });
    return made.length ? ["📄 " + made.join(", ") + " oluştu", "Boş dosya doğdu; içini sonra doldururuz."]
                       : ["📄 Zaten var", "Dosya varsa touch sadece tarihini günceller."];
  }
  function doMove(a, isMove) {
    if (!needFs()) return [isMove ? "✂️ Taşı" : "📑 Kopyala", "Dosya taşıma / kopyalama komutu."];
    if (a.length < 2) return ["⚠️ Eksik argüman", "İki şey gerekir: kaynak ve hedef. Örn: cp a.txt yedek/"];
    var srcStr = a[0], dstStr = a[a.length - 1];
    var sSegs = segsOf(srcStr), src = nodeAt(sSegs);
    if (!src) return ["🚫 " + srcStr + " yok", "Kaynak bulunamadı — 'ls' ile doğru ismi teyit et."];

    var dSegs = segsOf(dstStr), dNode = nodeAt(dSegs), parent, newName = src.n;
    if (dNode && dNode.d) { parent = dNode; }
    else if (/\/$/.test(dstStr)) { parent = ensureDir(dSegs); }
    else { parent = parentOf(dSegs) || ensureDir(dSegs.slice(0, -1)); newName = dSegs[dSegs.length - 1]; }
    if (!parent || !parent.d) return ["🚫 Hedef yok", "Hedef klasör bulunamadı."];

    var copy = JSON.parse(JSON.stringify(src));
    copy.n = newName; copy.fresh = true; copy.hit = true; copy.gone = false;
    for (var i = 0; i < parent.ch.length; i++) if (parent.ch[i].n === newName) { parent.ch.splice(i, 1); break; }
    parent.ch.push(copy); parent.open = true;

    if (isMove) {
      var par = parentOf(sSegs);
      if (par) for (var j = 0; j < par.ch.length; j++) if (par.ch[j] === src) { par.ch.splice(j, 1); break; }
    }
    return [(isMove ? "✂️ " : "📑 ") + src.n + " → " + pathStr(segsOf(dstStr)),
            isMove ? "mv hem taşır hem ad değiştirir: kaynak eski yerinde kalmaz."
                   : "cp kopya bırakır: orijinal yerinde durur, hedefte ikizi oluşur."];
  }
  function doRm(a) {
    if (!needFs()) return ["🗑️ Sil", "Dosya silme komutu — geri dönüşüm kutusu yok."];
    var gone = [];
    a.forEach(function (p) {
      var segs = segsOf(p), node = nodeAt(segs), par = parentOf(segs);
      if (!node || !par) return;
      node.gone = true; node.hit = true; gone.push(node.n);
      setTimeout(function () {                       // solma animasyonu bitince gerçekten sil
        for (var i = 0; i < par.ch.length; i++) if (par.ch[i] === node) { par.ch.splice(i, 1); break; }
        if (!nodeAt(S.cwd)) S.cwd = [S.root.n];
        render();
      }, 520);
    });
    if (!gone.length) return ["🚫 Bulunamadı", "Silinecek dosya yok — isim doğru mu?"];
    return ["🗑️ " + gone.join(", ") + " silindi", "rm sorusuz siler, çöp kutusu yoktur. Prod'da iki kez oku."];
  }
  function doChmod(t, a) {
    if (!needFs()) return ["🔓 İzin", "Dosya izinlerini değiştirme komutu."];
    var name = a[a.length - 1], segs = segsOf(name || ""), node = name ? nodeAt(segs) : null;
    var exec = t.some(function (x) { return /\+x|7|75|755|775/.test(x); });
    if (node) { node.hit = true; if (exec) node.x = true; }
    return [(exec ? "⚡ " : "🔐 ") + (name || "dosya") + (exec ? " artık çalıştırılabilir" : " izinleri değişti"),
            exec ? "x = execute. Bu bit olmadan script sadece metin dosyasıdır; artık ⚡ ikonuyla duruyor."
                 : "rwx: oku / yaz / çalıştır — sahip, grup, diğerleri için ayrı ayrı."];
  }
  function runScript(name) {
    var node = needFs() ? nodeAt(segsOf(name)) : null;
    if (node) { node.hit = true; node.run = true; }
    if (S.kind === "ci") set("p.build", "on", "script çalıştı");
    return ["▶️ " + name + " çalıştı",
            node && !node.x ? "Çalıştırma izni yoksa kabuk 'Permission denied' der — önce chmod +x."
                            : "./ = 'buradaki dosyayı çalıştır'. Deploy script'leri böyle tetiklenir."];
  }

  /* ---------------- sistem ---------------- */
  function doPs() {
    hit("proc");
    return ["🧠 Süreç listesi", "Her çalışan program bir PID'dir. Askıda kalan işi burada yakalarsın."];
  }
  function doKill(pid) {
    set("proc", "off", "pid " + (pid || "?") + " · sonlandırıldı");
    return ["⛔ " + (pid || "süreç") + " sonlandırıldı", "kill sinyal yollar. Hayalet süreç böyle temizlenir."];
  }
  function doDisk() {
    set("disk", "warn", "%78 dolu · 4.2G boş");
    return ["💾 Disk kullanımı", "Sunucu çöküşlerinin klasik sebebi: disk %100. df bunu erken söyler."];
  }
  function doPkg(a) {
    var name = a[a.length - 1] || "paket";
    if (/^(install|update|upgrade|remove)$/.test(name)) name = "paket";
    var i = item("pkg");
    if (i) { i.label = name; set("pkg", "on", "kuruldu"); } else add("SİSTEM", it("pkg:" + name, "📦", name, "kuruldu", "on"));
    return ["📦 " + name + " kuruldu", "Paket yöneticisi bağımlılıkları da getirir; tek tek indirmezsin."];
  }
  function doService(a) {
    var op = (a[0] || "status").toLowerCase(), svc = a[1] || "servis";
    var key = "nginx", i = item(key);
    if (!i || (i.label !== svc && svc !== "servis")) {
      if (i && (i.label === "nginx" || svc === "nginx")) { i.label = svc; }
      else { key = "svc:" + svc; if (!item(key)) add("SİSTEM", it(key, "⚙️", svc, "durdu", "off")); }
    }
    if (op === "start" || op === "restart" || op === "enable") {
      set(key, "on", op === "enable" ? "açılışta başlar" : "çalışıyor");
      return ["⚙️ " + svc + " çalışıyor", "Daemon = arka planda sürekli duran hizmet. Web sunucusu böyle ayağa kalkar."];
    }
    if (op === "stop" || op === "disable") {
      set(key, "off", "durdu");
      return ["⛔ " + svc + " durduruldu", "Servisi kapatmak da yönetimin parçası — bakım pencereleri böyle açılır."];
    }
    hit(key);
    return ["🔎 " + svc + " durumu", "status: çalışıyor mu, ne zamandır ayakta, son log satırları ne?"];
  }
  function doEnv(t) {
    var pair = t.slice(1).filter(function (x) { return x.indexOf("=") !== -1; })[0] || "";
    var k = pair.split("=")[0], val = pair.split("=")[1] || "";
    if (k) add("SİSTEM", it("env:" + k, "🔑", k, val, "on"));
    return [k ? "🔑 " + k + "=" + val + " ayarlandı" : "🔑 Ortam değişkenleri",
            "Ortam değişkeni = uygulamaya 'hangi ortamdasın' demenin yolu. Şifreler de böyle geçilir, kodda değil."];
  }

  /* ---------------- ağ ---------------- */
  function doPing(hostName) {
    set("api", "warn", "ICMP yanıt · 24 ms");
    return ["📡 " + (hostName || "hedef") + " yanıt verdi (24 ms)",
            "ping = 'orada mısın?'. Yanıt varsa makine ayakta; yoksa sorun ağda ya da makinede."];
  }
  function doDns(hostName) {
    set("dns", "on", (hostName || "api.internal") + " → 10.0.4.12");
    return ["🌐 İsim çözüldü → 10.0.4.12",
            "DNS isimden IP'ye çevirir. 'Site açılmıyor' vakalarının yarısı burada biter."];
  }
  function doCurl(t) {
    var url = t.slice(1).filter(function (x) { return /^https?:|:\d|\//.test(x) && x.charAt(0) !== "-"; })[0] || "";
    if (S.kind === "obs") {
      if (/prometheus|9090/.test(url)) { set("prom", "on", "up = 1"); set("met", "on", "sorgu çalıştı");
        return ["🔥 Prometheus sorgusu döndü", "Metrikleri PromQL ile sorgularsın: 'up' hedeflerin ayakta olup olmadığıdır."]; }
      if (/jaeger|16686/.test(url)) { set("trace", "on", "12 trace");
        return ["🧵 Trace'ler geldi", "Trace bir isteğin servisler arasındaki yolculuğunu gösterir — gecikme nerede belli olur."]; }
      set("health", "on", "200 OK");
      return ["❤️ /health → 200 OK", "Sağlık ucu: load balancer da tam bunu sorar. 200 dönmezse trafiği kesmez."];
    }
    set("api", "on", "HTTP 200 · yanıt var");
    return ["🌍 " + cut(url || "istek", 26) + " → 200 OK",
            "curl HTTP konuşur: sadece 'ayakta mı' değil, 'doğru cevap veriyor mu' sorusunu sorar."];
  }
  function doTrace(hostName) {
    ["you", "dns", "api"].forEach(hit);
    return ["🛰️ Yol: gw → firewall → " + (hostName || "hedef"),
            "traceroute paketin geçtiği durakları sayar. Nerede takıldığını gösterir."];
  }
  function doPorts() {
    var g = group("AÇIK PORTLAR");
    if (g && !g.items.length) {
      add("AÇIK PORTLAR", it("p22",   "🔑", "22",   "sshd", "on"));
      add("AÇIK PORTLAR", it("p8080", "🌍", "8080", "app", "on"));
      add("AÇIK PORTLAR", it("p3306", "🗄️", "3306", "mysql", "warn"));
    } else if (g) g.items.forEach(function (i) { i.hit = true; });
    return ["🔌 Dinlenen portlar listelendi",
            "Bir port kapalıysa servis ya çalışmıyor ya da yanlış arayüzü dinliyor. 3306'nın dışa açık olması risktir."];
  }
  function doSsh(target) {
    set("api", "on", "kabuk açık");
    if (target) { S.host = target.indexOf("@") !== -1 ? target : "engineer@" + target; S.ctx = "uzak kabuk · ssh"; }
    return ["🔐 " + (target || "sunucu") + " içindesin",
            "Artık komutlar UZAK makinede çalışıyor. Yukarıdaki host adı değişti — dikkat, prod olabilir."];
  }
  function doScp(a) {
    var src = a[0] || "dosya", dst = a[1] || "sunucu";
    return ["📤 " + src + " → " + cut(dst, 22), "scp dosyayı şifreli kanalla karşıya kopyalar. Config dağıtmanın en kısa yolu."];
  }

  /* ---------------- git ---------------- */
  function doGit(t, a) {
    if (S.kind !== "git") {                         // git sahnesi değilse sadece anlat
      if (a[0] === "push") { set("p.push", "on", "workflow tetiklendi"); return ["⬆️ push → pipeline tetiklendi", "GitHub'a düşen commit CI'ı otomatik başlatır."]; }
      return ["🐙 git " + (a[0] || ""), "Sürüm kontrolü: her değişikliğin kaydı ve geri dönüş yolu."];
    }
    var op = (a[0] || "").toLowerCase(), br = curBranch(), n;
    switch (op) {
      case "clone":
        set("repo", "on", "klonlandı · main"); S.ctx = "dal: main"; syncBranches();
        n = ["🐙 Depo klonlandı", "clone uzaktaki tüm geçmişi bilgisayarına indirir — commit'ler dahil."]; break;
      case "checkout": case "switch":
        var newBr = flag(t, "-b") || flag(t, "-c");
        var nameArg = a[a.length - 1];
        if (!newBr && (t.indexOf("-b") !== -1 || t.indexOf("-c") !== -1)) newBr = nameArg;
        if (newBr) {
          S.branches.forEach(function (b) { b.cur = false; });
          S.branches.push({ name: newBr, commits: br ? br.commits : 0, cur: true, pushed: false });
          S.ctx = "dal: " + newBr;
          n = ["🌿 " + newBr + " dalı açıldı", "Yeni dal = güvenli çalışma alanı. main bozulmaz, denemen serbest."];
        } else {
          var found = S.branches.filter(function (b) { return b.name === nameArg; })[0];
          if (found) { S.branches.forEach(function (b) { b.cur = false; }); found.cur = true; S.ctx = "dal: " + found.name; }
          n = ["➤ " + (nameArg || "dal") + " dalına geçildi", "Dal değiştirmek çalışma dosyalarını o dalın hâline çevirir."];
        }
        syncBranches(); break;
      case "add":
        set("wt", "warn", "hazırlandı (staged)");
        n = ["➕ Değişiklikler hazırlandı", "add = 'bu değişiklikleri commit'e alacağım' demek. Sahne hazırlığı."]; break;
      case "commit":
        if (br) br.commits++;
        set("wt", "idle", "temiz"); syncBranches();
        n = ["💾 Commit atıldı" + (flag(t, "-m") ? ": " + cut(flag(t, "-m"), 22) : ""),
             "Commit bir fotoğraf: mesajı gelecekteki sana yazılır. Dalda bir ● daha var."]; break;
      case "push":
        if (br) br.pushed = true; syncBranches();
        n = ["☁️ " + (br ? br.name : "dal") + " uzak sunucuya gitti",
             "push yerel commit'leri GitHub'a yükler. Artık takım da görüyor — ve CI çalışır."]; break;
      case "pull":
        var main = S.branches.filter(function (b) { return b.name === "main"; })[0] || br;
        if (main) main.commits++; syncBranches();
        n = ["⬇️ Uzaktaki değişiklikler alındı", "pull = fetch + merge. Güne başlarken ilk komut budur."]; break;
      case "merge":
        var other = a[1] || "dal";
        if (br) br.commits++; syncBranches();
        n = ["🔀 " + other + " → " + (br ? br.name : "dal") + " birleştirildi",
             "Merge iki tarihi birleştirir. Aynı satıra iki kişi dokunduysa çakışmayı sen çözersin."]; break;
      case "status": hit("wt"); n = ["🔎 Durum", "Neyi değiştirdim, neyi henüz commit etmedim? Şüphede kalınca bu."]; break;
      case "diff":   hit("wt"); n = ["📝 Satır satır fark", "diff tam olarak hangi satırın değiştiğini gösterir."]; break;
      case "log":    syncBranches(); n = ["📚 Geçmiş", "log commit zincirini gösterir: kim, ne zaman, neden."]; break;
      default: n = ["🐙 git " + op, "Sürüm kontrolünün gündelik dili."];
    }
    return n;
  }
  function doGh(t, a) {
    var op = (a[0] || "") + " " + (a[1] || "");
    if (/^secret/.test(op)) { set("secret", "on", "tanımlı · şifreli"); return ["🔐 Secret kaydedildi", "Anahtar depoda şifreli durur; log'a asla düşmez. Kodun içine ASLA yazılmaz."]; }
    if (/^workflow/.test(op)) { set("p.deploy", "run", "çalışıyor…"); return ["🚀 Workflow tetiklendi", "Pipeline sunucuda çalışıyor: build → test → deploy sırayla akar."]; }
    if (/^run/.test(op)) { set("p.deploy", "on", "yeşil ✓"); return ["✅ Pipeline yeşil", "Her adım geçtiyse deploy tamam. Kırmızıysa log'a bakıp düzeltirsin."]; }
    return ["🐙 gh " + op, "GitHub'ı terminalden yönetirsin — tarayıcıya gerek yok."];
  }

  /* ---------------- AWS ---------------- */
  /* Anahtar: "servis:işlem" → sahnedeki satırı güncelle. Satır bu sahnede
     yoksa sadece açıklama yazılır (aynı harita ch3 ve ch8 için çalışır). */
  function doAws(t) {
    var svc = (t[1] || "").toLowerCase(), op = (t[2] || "").toLowerCase();

    switch (svc + ":" + op) {
      case "configure:":
        set("iam.cfg", "on", "profil hazır");
        return ["🔑 CLI kimliği ayarlandı",
                "Access key + secret + bölge. Bundan sonra her aws komutu senin adına konuşur."];
      case "iam:create-user":
        set("iam.user", "on", flag(t, "--user-name") || "app-bot");
        return ["👤 IAM kullanıcısı oluştu",
                "İnsan değil, uygulama için kimlik. Kök hesabı asla günlük işte kullanmazsın."];
      case "iam:attach-user-policy":
        set("iam.pol", "on", cut(tail(flag(t, "--policy-arn")), 20));
        return ["📜 Policy bağlandı",
                "Yetki = policy. En az yetki ilkesi: sadece gerekeni ver, fazlası açık kapıdır."];
      case "iam:create-role":
        set("iam.role", "on", flag(t, "--role-name") || "rol");
        return ["🎭 IAM rolü oluştu",
                "Rol ödünç alınan kimliktir: EC2 rol takar, anahtar taşımaz. En temiz yol."];
      case "iam:list-attached-user-policies":
        set("iam.pol", "warn", "denetleniyor");
        return ["🔎 Yetkiler listelendi",
                "Denetim böyle başlar: kimde ne var? Fazla yetki en sık güvenlik bulgusudur."];
      case "iam:detach-user-policy":
        set("iam.pol", "on", "fazla yetki kaldırıldı");
        return ["✂️ Aşırı yetki söküldü", "Admin yetkisi bir bot'ta durmaz. Kaldırınca saldırı yüzeyi küçülür."];

      case "ec2:create-vpc":
        set("vpc", "on", flag(t, "--cidr-block") || "10.0.0.0/16");
        return ["🕸️ VPC kuruldu", "Kendi özel ağın. İçindeki her şey senin adres alanında yaşar."];
      case "ec2:create-subnet":
        set("subnet", "on", flag(t, "--cidr-block") || "10.0.1.0/24");
        return ["🔀 Subnet açıldı", "Ağı bölmelere ayırırsın: public (internete bakan) ve private (bakmayan)."];
      case "ec2:create-internet-gateway":
        set("igw", "on", "ağa bağlı");
        return ["🚪 İnternet kapısı açıldı", "IGW olmadan VPC kapalı bir kutudur — dışarıyla konuşamaz."];
      case "ec2:create-security-group":
        set("sg", "on", flag(t, "--group-name") || "web-sg");
        return ["🛡️ Güvenlik grubu oluştu", "Sunucu önündeki güvenlik duvarı: hangi port, hangi IP'ye açık?"];
      case "ec2:create-key-pair":
        set("key", "on", flag(t, "--key-name") || "cq-key");
        return ["🗝️ SSH anahtarı üretildi", "Özel anahtar sende kalır. Kaybedersen makineye giremezsin — yedekle."];
      case "ec2:run-instances":
        set("ec2", "on", (flag(t, "--instance-type") || "t3.micro") + " · çalışıyor");
        return ["🖥️ Sunucu ayağa kalktı",
                "Bulutta makine açmak 30 saniye. Kapatmayı unutursan fatura da 30 saniyede büyür."];
      case "ec2:describe-instances":
        hit("ec2");
        return ["🔎 Sunucular listelendi", "describe = 'ne var, hangi durumda, IP'si ne?'"];
      case "ec2:allocate-address":
        set("eip", "on", "sabit IP");
        return ["📡 Elastic IP alındı", "Yeniden başlayan makinenin IP'si değişir; Elastic IP sabit kalır."];
      case "ec2:stop-instances":
        set("ec2", "warn", "durduruldu"); set("idle", "on", "boşta kaynak kapatıldı");
        return ["🛑 Sunucu durduruldu", "Çalışmayan makine para yakmaz. Maliyet kontrolünün en kolay adımı."];
      case "ec2:create-tags":
        set("tags", "on", "Team=platform");
        return ["🏷️ Etiket eklendi",
                "Etiket olmadan faturada hangi ekip ne harcadı bilinmez. Maliyet takibi etiketle başlar."];

      case "s3:mb":
        set("s3", "on", cut(tail(t[3] || "bucket", "/"), 22));
        return ["🪣 S3 bucket açıldı", "Nesne deposu: dosya sistemi değil, sınırsız kova. Statik site bile barındırır."];
      case "s3:cp": case "s3:sync":
        set("s3", "on", "1 nesne yüklendi");
        return ["⬆️ Dosya bucket'a yüklendi",
                "Yükledin, artık dayanıklı (11 dokuz) depoda. Yerel diske güvenmek zorunda değilsin."];
      case "s3api:put-bucket-versioning":
        set("s3", "on", "sürümleme açık");
        return ["🕰️ Sürümleme açıldı",
                "Yanlış dosyayı üzerine yazdın mı? Eski sürüm hâlâ orada. Kazara silmeye karşı sigorta."];
      case "s3api:put-public-access-block":
        set("s3.public", "on", "public erişim kapalı");
        return ["🚧 Public erişim kapatıldı", "Veri sızıntılarının klasik sebebi: açık bucket. Bu blok onu kökten kapatır."];
      case "s3api:put-bucket-encryption":
        set("s3.enc", "on", "AES256 · varsayılan");
        return ["🔒 Şifreleme açıldı", "Diskte duran veri de şifreli olmalı. Uyum denetimleri ilk buna bakar."];

      case "rds:create-db-instance":
        set("rds", "on", (flag(t, "--engine") || "mysql") + " · " + (flag(t, "--db-instance-class") || "db.t3.micro"));
        return ["🗄️ Veritabanı oluşturuluyor", "Yönetilen veritabanı: yedek, yama, replika AWS'te. Sen şemaya bakarsın."];
      case "rds:describe-db-instances":
        hit("rds");
        return ["🔎 Veritabanı durumu", "'available' olana kadar bekler. Oluşturma dakikalar sürer."];
      case "rds:stop-db-instance":
        set("rds", "warn", "durduruldu");
        return ["🛑 Veritabanı durduruldu", "Test veritabanını geceleri kapatmak faturayı ciddi düşürür."];

      case "secretsmanager:create-secret":
        set("secret", "on", cut(flag(t, "--name") || "db-pass", 18));
        return ["🔐 Sır kasaya kondu",
                "Şifre koda ya da .env'e değil kasaya yazılır; erişim log'lanır ve döndürülebilir."];
      case "cloudtrail:create-trail":
        set("trail", "on", "kayıt açık");
        return ["🧭 Denetim izi açıldı", "Kim, ne zaman, hangi API'yi çağırdı? Olay sonrası tek dayanağın bu."];
      case "ce:get-cost-and-usage":
        set("cost", "on", "rapor geldi");
        return ["💸 Maliyet raporu", "Nereye para gidiyor? Sürprizi faturada değil burada görürsün."];
      case "budgets:create-budget":
        set("budget", "on", "alarm kurulu");
        return ["🎯 Bütçe alarmı kuruldu", "Eşiği aşınca e-posta gelir. 'Fark etmedim' diye biten hikâyeleri bitirir."];

      default:
        return ["☁️ aws " + svc + (op ? " " + op : ""), "AWS CLI: konsolda tıkladığın her şeyin komut hâli."];
    }
  }

  /* ---------------- terraform ---------------- */
  function doTf(t, a) {
    var op = (a[0] || "").toLowerCase(), sub = (a[1] || "").toLowerCase();
    var vars = flag(t, "-var") || flag(t, "-var-file");
    switch (op) {
      case "init":     set("s.init", "on", "sağlayıcı indirildi"); return ["⬇️ init tamam", "Sağlayıcı eklentileri indi. Her yeni klasörde ilk komut budur."];
      case "fmt":      hit("f.main"); return ["🧹 Kod biçimlendi", "fmt girintileri düzeltir. Ekipte kod tartışması azalır."];
      case "validate": set("s.val", "on", "sözdizimi geçerli"); return ["✅ Sözdizimi geçerli", "Yazım hatasını buluta gitmeden yakalar — ucuz kontrol."];
      case "plan":
        set("s.plan", "on", vars ? cut(vars, 20) : "+3 ~0 -0");
        return ["📋 Plan: 3 ekle, 0 değiştir, 0 sil", "plan prova: hiçbir şeye dokunmadan ne olacağını söyler. Apply'dan önce her zaman oku."];
      case "apply":
        var repl = flag(t, "-replace");
        if (repl) { set("s.apply", "on", "1 kaynak yenilendi"); add("YÖNETİLEN KAYNAK", it("r:" + repl, "♻️", cut(repl, 20), "yeniden oluştu", "warn"));
          return ["♻️ Kaynak yeniden oluşturuldu", "Bozulan kaynağı elle düzeltmek yerine yok edip aynı koddan yeniden kurarsın."]; }
        set("s.apply", "on", "3 kaynak oluştu"); set("f.state", "on", "3 kaynak");
        add("YÖNETİLEN KAYNAK", it("r:web",  "🖥️", "aws_instance.web", "çalışıyor", "on"));
        add("YÖNETİLEN KAYNAK", it("r:sg",   "🛡️", "aws_security_group.web", "aktif", "on"));
        add("YÖNETİLEN KAYNAK", it("r:buck", "🪣", "aws_s3_bucket.assets", "hazır", "on"));
        return ["🚀 Altyapı ayağa kalktı" + (vars ? " · " + cut(vars, 16) : ""),
                "Tıklamayla değil kodla kurdun: aynı dosya yarın aynı altyapıyı bir daha kurar."];
      case "destroy":
        var g = group("YÖNETİLEN KAYNAK"); if (g) g.items = [];
        set("f.state", "off", "boş"); set("s.apply", "off", "—");
        return ["💥 Her şey silindi", "destroy tek komutla temizler. Test ortamında dost, prod'da kâbus — dikkat."];
      case "output":   hit("f.state"); return ["📤 Çıktılar", "IP, DNS gibi değerleri koddan dışa verirsin; sonraki adım onları kullanır."];
      case "console":  hit("f.main"); return ["🧪 Terraform konsolu", "İfadeleri canlı denersin — döngü ve fonksiyonları öğrenmenin en hızlı yolu."];
      case "get":      hit("f.main"); return ["📚 Modüller indirildi", "Modül = tekrar kullanılabilir altyapı paketi. Kopyala-yapıştır bitiyor."];
      case "graph":    return ["🕸️ Bağımlılık grafiği", "Neyin neye bağlı olduğunu çizer: subnet olmadan sunucu doğmaz."];
      case "workspace":
        if (sub === "new" || sub === "select") { S.ctx = "workspace: " + (a[2] || "prod"); return ["🗂️ Workspace: " + (a[2] || "prod"), "Aynı kodla ayrı ortamlar (dev/prod) — state dosyaları ayrı tutulur."]; }
        return ["🗂️ Workspace listesi", "Ortamlar arası geçiş burada."];
      case "import":
        add("YÖNETİLEN KAYNAK", it("r:legacy", "🧲", cut(a[1] || "legacy", 20), "içeri alındı", "warn"));
        set("f.state", "on", "eski kaynak dahil");
        return ["🧲 Elle kurulmuş kaynak içeri alındı", "Import mevcut kaynağı state'e bağlar; artık onu da kod yönetir."];
      case "state":
        if (sub === "show") { hit("f.state"); return ["🔎 Kaynağın state kaydı", "Terraform'un gerçekliği state dosyasıdır — tüm karar oradan çıkar."]; }
        if (sub === "mv")   { hit("f.state"); return ["🚚 State kaydı taşındı", "Kaynağı modüle taşırken silip yeniden kurmazsın; sadece kaydın adresi değişir."]; }
        if (sub === "pull") { hit("f.state"); return ["⬇️ State yedeklendi", "Riskli işlemden önce state'in kopyasını al — geri dönüş biletin."]; }
        hit("f.state");
        return ["🧭 State listesi", "Terraform neyi yönettiğini state'ten bilir. State kaybolursa hafıza kaybolur."];
      case "providers": hit("f.main"); return ["🔌 Sağlayıcılar", "Hangi bulut eklentisi, hangi sürüm? Sürümü sabitlemek sürprizi önler."];
      case "show":      hit("f.state"); return ["🔎 Kayıtlı durum", "state'in okunabilir hâli: hangi kaynak, hangi değerle duruyor?"];
      case "force-unlock": return ["🔓 State kilidi açıldı", "Yarıda kesilen apply kilidi bırakır. Kilidi kırmadan önce gerçekten kimse çalışmıyor mu, teyit et."];
      default: return ["🌍 terraform " + op, "Altyapıyı kodla tanımla, versiyonla, tekrar kur."];
    }
  }

  /* ---------------- docker / kubernetes ---------------- */
  function doDocker(t, a) {
    var op = (a[0] || "").toLowerCase();
    switch (op) {
      case "build":
        set("img", "on", cut(flag(t, "-t") || "myapp:1.0", 18));
        return ["📦 İmaj derlendi", "Dockerfile → imaj. Uygulaman artık her yerde aynı çalışan bir paket."];
      case "run":
        var p = t.filter(function (x) { return /^\d+:\d+$/.test(x); })[0];
        set("cont", "on", (p || "çalışıyor"));
        return ["🚢 Konteyner çalışıyor" + (p ? " · " + p : ""), "-p 8080:80 = dışarıdaki 8080, içerideki 80'e bağlanır. Port eşlemesi budur."];
      case "ps":     hit("cont"); return ["🔎 Çalışan konteynerler", "Ayakta olanları görürsün; -a durmuş olanları da getirir."];
      case "compose": set("cont", "on", "compose · çok servis"); return ["🎼 Compose ile hepsi kalktı", "Uygulama + veritabanı + cache tek dosyadan. Tek komutla ayağa kalkar."];
      case "exec":   hit("cont"); return ["🔧 Konteynerin içindesin", "Kabuk aç, log'a bak, dosyayı gör. Hata ayıklamanın en doğrudan yolu."];
      case "volume": set("vol", "on", cut(a[a.length - 1] || "appdata", 16)); return ["💾 Volume oluştu", "Konteyner ölünce veri de ölür — volume kalıcı belleğidir."];
      case "tag":    hit("img"); return ["🏷️ İmaj etiketlendi", "İsim + sürüm. 'latest' ile çalışmak prod'da baş ağrısıdır."];
      case "push":   set("reg", "on", "registry'de"); return ["☁️ İmaj registry'e gitti", "Artık başka makine (ve k8s) bu imajı indirebilir."];
      case "pull":   set("img", "on", "indirildi"); return ["⬇️ İmaj indirildi", "Başkasının hazırladığı paketi tek komutla kullanırsın."];
      case "logs":   hit("cont"); return ["🪵 Konteyner log'ları", "Uygulama içeride ne diyor? İlk bakılacak yer."];
      case "login":  hit("reg"); return ["🔑 Registry girişi", "Kendi imajlarını yükleyebilmek için kimlik doğrularsın."];
      case "images": case "history": hit("img");
        return ["🔎 İmaj katmanları", "Her satır bir katman. Katmanı küçültmek imajı küçültür, deploy'u hızlandırır."];
      case "inspect": hit("img"); return ["🔬 İmaj/konteyner detayı", "Ortam değişkeni, mount, ağ — hepsi tek JSON'da."];
      case "network": add("KONTEYNER", it("net", "🕸️", "network", cut(a[a.length - 1] || "appnet", 14), "on"));
        return ["🕸️ Konteyner ağı oluştu", "Aynı ağdaki konteynerler birbirini isimle bulur — IP ezberlemek yok."];
      case "system": case "prune": return ["🧹 Kullanılmayanlar silindi", "Ölü imaj ve katmanlar diski doldurur; prune yer açar."];
      default: return ["🐳 docker " + op, "Paketle, taşı, her yerde aynı şekilde çalıştır."];
    }
  }
  function doKubectl(t, a) {
    var op = (a[0] || "").toLowerCase(), what = (a[1] || "").toLowerCase();
    if (op === "get" && /node/.test(what))  { set("nodes", "on", "3 node hazır"); return ["🧩 Cluster node'ları", "Kubernetes bir makine havuzudur; pod'ları uygun node'a kendisi yerleştirir."]; }
    if (op === "get" && /pod/.test(what))   { set("pods", "on", item("pods") && /replika/.test(item("pods").meta) ? item("pods").meta : "1 replika · Running"); return ["🟢 Pod listesi", "Pod = bir veya birkaç konteynerin en küçük çalışma birimi."]; }
    if (op === "top")                       { set("met", "on", "cpu %62 · mem %48"); return ["📈 Kaynak kullanımı", "Hangi pod CPU yiyor? Ölçmeden büyütmek karanlıkta ateş etmektir."]; }
    if (op === "create" && /deployment/.test(what)) { set("dep", "on", cut(flag(t, "--image") || "myapp:1.0", 18)); set("pods", "on", "1 replika"); return ["🚀 Deployment oluştu", "Deployment 'kaç kopya, hangi imaj' der; k8s bu hâli sürekli korur."]; }
    if (op === "create" && /configmap/.test(what))  { add("KUBERNETES", it("cm", "🗂️", "configmap", cut(flag(t, "--from-literal") || "ENV=prod", 16), "on")); return ["🗂️ ConfigMap oluştu", "Ayarı imajdan ayırırsın: aynı imaj dev'de ve prod'da farklı davranır."]; }
    if (op === "expose")                    { set("svc", "on", (flag(t, "--type") || "ClusterIP") + " · " + (flag(t, "--port") || "80")); return ["🌐 Service açıldı", "Pod'lar gelip gider, IP'leri değişir. Service sabit adrestir."]; }
    if (op === "scale")                     { var r = flag(t, "--replicas") || "3"; set("pods", "on", "▣".repeat(Math.min(parseInt(r, 10) || 1, 8)) + " " + r + " replika"); return ["📐 " + r + " replikaya çıkıldı", "Yatay ölçekleme: tek makineyi büyütmek yerine kopya sayısını artırırsın."]; }
    if (op === "rollout")                   { set("dep", "warn", "önceki sürüme dönüldü"); return ["↩️ Sürüm geri alındı", "Bozuk deploy'u saniyeler içinde geri alırsın — k8s eski ReplicaSet'i saklar."]; }
    if (op === "logs")                      { set("log", "on", "pod log'u"); return ["🪵 Pod log'ları", "Konteyner çıktısı doğrudan buraya akar."]; }
    if (op === "apply")                     { set("dep", "on", "manifest uygulandı"); set("p.deploy", "on", "cluster'a gitti"); return ["📜 Manifest uygulandı", "Bildirimsel yönetim: 'şu hâlde olsun' dersin, k8s o hâle getirir."]; }
    if (op === "port-forward")              { set("graf", "on", "localhost:3000"); return ["🔌 Port yönlendirildi", "Cluster içindeki paneli kendi makinende açarsın — dışa açmadan."]; }
    if (op === "describe")                  { hit("pods"); return ["🔬 Pod detayı ve olaylar", "Pod neden başlamıyor? Cevap 'Events' bölümünün son satırlarındadır."]; }
    if (op === "autoscale")                 { add("KUBERNETES", it("hpa", "📐", "autoscale", (flag(t, "--min") || "2") + "–" + (flag(t, "--max") || "10") + " kopya", "on"));
                                              return ["📐 Otomatik ölçekleme kuruldu", "Yük artınca kopya sayısı kendi artar, düşünce geri iner. Gece uyanmazsın."]; }
    if (op === "get" && /hpa/.test(what))   { hit("hpa"); return ["📈 Ölçekleyici durumu", "Şu an kaç kopya var, hedef CPU'nun neresindeyiz?"]; }
    if (op === "create" && /namespace/.test(what)) { add("KUBERNETES", it("ns", "🏷️", "namespace", cut(a[2] || "prod", 12), "on"));
                                              return ["🏷️ Namespace oluştu", "Aynı cluster'da ekipleri/ortamları ayırmanın yolu — isim çakışması bitiyor."]; }
    if (op === "create" && /quota/.test(what)) { add("KUBERNETES", it("quota", "⚖️", "resource quota", "cpu/mem sınırı", "on"));
                                              return ["⚖️ Kaynak kotası kuruldu", "Bir ekip bütün cluster'ı yiyemez: sınır koyarsın."]; }
    if (op === "create" && /secret/.test(what)) { add("KUBERNETES", it("k8s.secret", "🔐", "secret", "şifreli", "on"));
                                              return ["🔐 Secret oluştu", "Şifre pod'a ortam değişkeni ya da dosya olarak geçer; manifest'te açık durmaz."]; }
    if (op === "get" && /secret/.test(what))    { hit("k8s.secret"); return ["🔎 Secret listesi", "İçerik base64'tür — şifreleme değil kodlama. RBAC olmadan güvenli değildir."]; }
    if (op === "get" && /pvc|volume/.test(what)) { hit("vol"); return ["💾 Kalıcı disk talebi", "Pod ölse de veri kalsın istiyorsan PVC gerekir."]; }
    if (op === "get" && /event/.test(what))     { return ["📜 Cluster olayları", "Zaman sırasına dizince 'ne zaman bozuldu' sorusu cevaplanır."]; }
    if (op === "get" && /all/.test(what))       { return ["🔎 Namespace'teki her şey", "Deployment, pod, service, replica — tek bakışta."]; }
    if (op === "exec")                          { hit("pods"); return ["🔧 Pod'un içindesin", "Kabuk açıp dosyaya, ortam değişkenine, ağa bakarsın."]; }
    if (op === "config")                        { return ["⚙️ kubectl bağlamı", "Hangi cluster, hangi namespace? Yanlış bağlamda komut çalıştırmak klasik kazadır."]; }
    return ["☸️ kubectl " + op, "Cluster ile konuşma dili."];
  }
  function doNpm(a) {
    var op = (a[0] || "").toLowerCase();
    if (op === "test")  { set("p.test", "on", "3/3 geçti"); return ["🧪 Testler geçti", "Kırmızı test deploy'u durdurur. Güvenlik ağın budur."]; }
    if (/build|run/.test(op)) { set("p.build", "on", "başarılı"); return ["🏗️ Build başarılı", "Kaynak kod dağıtılabilir çıktıya dönüştü."]; }
    return ["📦 npm " + op, "Bağımlılıkları ve script'leri yönetir."];
  }

  /* =======================================================================
     ÇİZİM
     ======================================================================= */
  function note(cmd, title, text) {
    S.note = { cmd: cmd, title: title, text: text };
  }

  function pathHtml() {
    var out = ['<span class="sc-pin">📍</span>'];
    S.cwd.forEach(function (seg, i) {
      if (i) out.push('<span class="sc-sep">/</span>');
      out.push('<span class="sc-seg' + (i === S.cwd.length - 1 ? " cur" : "") + '">' + esc(seg) + "</span>");
    });
    return '<div class="sc-path' + (pathHit ? " hit" : "") + '">' + out.join("") + "</div>";
  }

  function treeHtml(node, segs, depth) {
    var isCwd = segs.join("/") === S.cwd.join("/");
    var cls = ["sc-node"];
    if (node.d) cls.push("is-dir"); else cls.push("is-file");
    if (isCwd) cls.push("is-cwd");
    if (node.hit) cls.push("hit");
    if (node.fresh) cls.push("fresh");
    if (node.gone) cls.push("gone");
    if (node.run) cls.push("run");

    var icon = node.d ? (node.open ? "📂" : "📁") : fileIcon(node);
    var badge = node.d ? "" : (node.x ? '<span class="sc-badge x">x</span>' : "") +
                              (node.read ? '<span class="sc-badge r">👁</span>' : "");
    var html = '<div class="' + cls.join(" ") + '" style="--d:' + depth + '">' +
                 '<span class="sc-ico">' + icon + "</span>" +
                 '<span class="sc-nm">' + esc(node.n) + (node.d ? "/" : "") + "</span>" +
                 badge + (isCwd ? '<span class="sc-here">buradasın</span>' : "") +
               "</div>";
    if (node.d && node.open) {
      node.ch.slice().sort(sortDirFirst).forEach(function (c) {
        html += treeHtml(c, segs.concat([c.n]), depth + 1);
      });
    }
    return html;
  }

  function boardHtml() {
    return (S.groups || []).filter(function (g) { return g.items.length; }).map(function (g) {
      return '<div class="sc-group' + (g.chain ? " chain" : "") + '">' +
               '<div class="sc-glabel">' + esc(g.label) + "</div>" +
               g.items.map(function (i) {
                 var cls = ["sc-item", "st-" + i.state];
                 if (i.hit) cls.push("hit");
                 if (i.fresh) cls.push("fresh");
                 return '<div class="' + cls.join(" ") + '">' +
                          '<span class="sc-ico">' + i.icon + "</span>" +
                          '<span class="sc-lb">' + esc(i.label) + "</span>" +
                          '<span class="sc-meta">' + esc(i.meta) + "</span>" +
                        "</div>";
               }).join("") +
             "</div>";
    }).join("");
  }

  function clearFlags() {
    pathHit = false;
    if (S.root) (function walk(n) { n.hit = false; n.fresh = false; n.run = false; (n.ch || []).forEach(walk); })(S.root);
    (S.groups || []).forEach(function (g) { g.items.forEach(function (i) { i.hit = false; i.fresh = false; }); });
  }

  function render() {
    if (!box || !S) return;

    var dots = "";
    if (head.total) {
      for (var i = 0; i < head.total; i++) {
        dots += '<span class="sc-dot' + (i < head.step ? " done" : (i === head.step ? " cur" : "")) + '"></span>';
      }
    }

    el.head.innerHTML =
      '<div class="sc-host"><span class="sc-hico">' + (S.icon || "🖥️") + "</span>" +
        "<b>" + esc(S.host) + "</b></div>" +
      '<div class="sc-ctx">' + esc(S.ctx || "") + "</div>" +
      (S.cwd ? pathHtml() : "") +
      (head.title ? '<div class="sc-quest">' + esc(cut(head.title, 30)) +
                    (head.total ? '<span class="sc-stepn">' + (head.step + 1) + "/" + head.total + "</span>" : "") +
                    "</div>" : "") +
      (dots ? '<div class="sc-dots">' + dots + "</div>" : "") +
      (head.task ? '<div class="sc-task">🎯 ' + esc(cut(head.task, 96)) + "</div>" : "");

    el.body.innerHTML = (S.root ? '<div class="sc-tree">' + treeHtml(S.root, [S.root.n], 0) + "</div>" : "") + boardHtml();

    var n = S.note;
    el.note.innerHTML = n
      ? '<div class="sc-ncmd">$ ' + esc(cut(n.cmd, 34)) + "</div>" +
        '<div class="sc-ntitle">' + esc(n.title) + "</div>" +
        '<div class="sc-ntext">' + esc(n.text) + "</div>"
      : '<div class="sc-ntext sc-idle">Komut yazdıkça burada ne olduğunu göstereceğim.</div>';

    clearFlags();
  }

  /* =======================================================================
     DIŞ ARAYÜZ
     ======================================================================= */
  function mount(node) {
    box = node;
    box.innerHTML =
      '<div class="sc-title">🗺️ SAHNE<span class="sc-sub">ne yaptığını gör</span></div>' +
      '<div class="sc-head" id="sc-head"></div>' +
      '<div class="sc-body" id="sc-body"></div>' +
      '<div class="sc-note" id="sc-note" aria-live="polite"></div>';
    el.head = box.querySelector("#sc-head");
    el.body = box.querySelector("#sc-body");
    el.note = box.querySelector("#sc-note");
  }

  function hub(stats) {
    S = hubScene(stats);
    head = { title: "", step: 0, total: 0, task: "" };
    S.note = { cmd: "", title: "🎬 Sahne hazır",
               text: "Bir quest başlat: yazdığın her komutun etkisini burada göreceksin." };
    render();
  }

  function quest(q) {
    var kind = BY_QUEST[q.id] || BY_CHAPTER[q.chapter] || guessKind(q);
    S = (BUILD[kind] || fsScene)();
    if (kind === "git") syncBranches();
    head = { title: q.title, step: 0, total: (q.objectives || []).length, task: "" };
    S.note = { cmd: "", title: "▶️ " + cut(q.title, 26),
               text: "Aşağıdaki hedefi terminale yaz — sonucu burada canlanacak." };
    render();
  }

  function step(i, total, task) {
    head.step = i; head.total = total; head.task = task || "";
    render();
  }

  return { mount: mount, hub: hub, quest: quest, step: step, apply: apply, render: render };
})();
