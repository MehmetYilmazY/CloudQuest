/* =========================================================================
   CloudQuest — Terminal 101 (sıfır bilgi öğreticisi)
   -------------------------------------------------------------------------
   Hiç terminal görmemiş biri için: komut nedir, prompt ne der, argüman/flag
   nedir. İçinde GERÇEKTEN çalışan bir mini kabuk var — sanal dosya sistemi
   üzerinde pwd/ls/cd/cat/mkdir/echo çalışır, çıktı gerçekçidir.

   Tasarım: adım adım, geri alınamaz hata yok, her adımda "neden" açıklanır.
   ========================================================================= */
var Tutorial = (function () {
  "use strict";

  const BADGE = "⌨️ Terminal Rookie";

  /* ---------------- sanal dosya sistemi ---------------- */
  function freshFS() {
    return {
      "/home/engineer": { type: "dir", children: ["belgeler", "indirilenler", "merhaba.txt"] },
      "/home/engineer/belgeler": { type: "dir", children: ["notlar.txt", "plan.txt"] },
      "/home/engineer/indirilenler": { type: "dir", children: ["kurulum.sh"] },
      "/home/engineer/merhaba.txt": { type: "file", body: "Merhaba! Bu bir metin dosyası.\nTerminalden okundun. 👋" },
      "/home/engineer/belgeler/notlar.txt": { type: "file", body: "- terminal öğren\n- bulut öğren\n- işi kap" },
      "/home/engineer/belgeler/plan.txt": { type: "file", body: "Hafta 1: Linux\nHafta 2: Ağ + Git\nHafta 3: AWS" },
      "/home/engineer/indirilenler/kurulum.sh": { type: "file", body: "#!/bin/bash\necho 'kurulum basladi'" }
    };
  }

  let FS = freshFS();
  let cwd = "/home/engineer";

  function norm(p) { return p.replace(/\/+$/, "") || "/"; }
  function resolve(arg) {
    if (!arg || arg === "~") return "/home/engineer";
    if (arg === "..") { var parts = cwd.split("/"); parts.pop(); return norm(parts.join("/")) || "/"; }
    if (arg === ".") return cwd;
    if (arg.charAt(0) === "/") return norm(arg);
    return norm(cwd + "/" + arg);
  }
  function shortCwd() { return cwd.replace("/home/engineer", "~"); }

  /* ---------------- mini kabuk ---------------- */
  function runCommand(raw) {
    var t = raw.trim();
    if (!t) return null;
    var parts = t.split(/\s+/);
    var cmd = parts[0];
    var args = parts.slice(1).filter(function (a) { return a.charAt(0) !== "-"; });
    var flags = parts.slice(1).filter(function (a) { return a.charAt(0) === "-"; }).join("");

    switch (cmd) {
      case "pwd": return { out: cwd };
      case "ls": {
        var target = resolve(args[0]);
        var node = FS[target];
        if (!node) return { out: "ls: '" + (args[0] || "") + "': Böyle bir dosya ya da dizin yok", err: true };
        if (node.type === "file") return { out: args[0] };
        if (flags.indexOf("l") !== -1) {
          return { out: node.children.map(function (c) {
            var isDir = FS[norm(target + "/" + c)] && FS[norm(target + "/" + c)].type === "dir";
            return (isDir ? "drwxr-xr-x" : "-rw-r--r--") + "  engineer  " + (isDir ? "4096" : "  128") + "  " + c;
          }).join("\n") };
        }
        return { out: node.children.map(function (c) {
          var isDir = FS[norm(target + "/" + c)] && FS[norm(target + "/" + c)].type === "dir";
          return isDir ? c + "/" : c;
        }).join("   ") };
      }
      case "cd": {
        var dest = resolve(args[0]);
        if (!FS[dest]) return { out: "cd: " + (args[0] || "") + ": Böyle bir dizin yok", err: true };
        if (FS[dest].type !== "dir") return { out: "cd: " + args[0] + ": Bu bir dizin değil", err: true };
        cwd = dest; return { out: "" };
      }
      case "cat": {
        if (!args[0]) return { out: "cat: hangi dosya? Örnek: cat merhaba.txt", err: true };
        var f = resolve(args[0]);
        if (!FS[f]) return { out: "cat: " + args[0] + ": Böyle bir dosya yok", err: true };
        if (FS[f].type === "dir") return { out: "cat: " + args[0] + ": Bu bir dizin", err: true };
        return { out: FS[f].body };
      }
      case "mkdir": {
        if (!args[0]) return { out: "mkdir: klasör adı gerekli. Örnek: mkdir projeler", err: true };
        var np = resolve(args[0]);
        if (FS[np]) return { out: "mkdir: '" + args[0] + "' zaten var", err: true };
        FS[np] = { type: "dir", children: [] };
        FS[cwd].children.push(args[0]);
        return { out: "" };
      }
      case "echo": return { out: t.slice(4).trim().replace(/^["']|["']$/g, "") };
      case "clear": return { clear: true };
      case "help": return { out: "Kullanabileceğin komutlar:\n  pwd   nerdeyim\n  ls    listele  (ls -l detaylı)\n  cd    klasör değiştir\n  cat   dosya oku\n  mkdir klasör oluştur\n  echo  ekrana yaz\n  clear ekranı temizle" };
      default:
        return { out: cmd + ": komut bulunamadı. 'help' yazıp listeye bakabilirsin.", err: true };
    }
  }

  /* ---------------- dersler ---------------- */
  const LESSONS = [
    {
      title: "Terminal nedir?",
      body: "Bilgisayara <b>fare yerine yazarak</b> komut verdiğin pencere.<br>" +
            "Tıklamak yerine yazıyorsun — daha hızlı, tekrarlanabilir ve otomatikleştirilebilir.",
      diagram:
        '<div class="t-anatomy">' +
          '<div class="t-anno"><span class="t-tag">1 · PROMPT</span><span class="t-desc">Terminal “hazırım” diyor</span></div>' +
          '<div class="t-line"><b class="t-p">engineer@cloudquest:~$</b> <span class="t-c">ls</span> <span class="t-f">-l</span> <span class="t-a">belgeler</span></div>' +
          '<div class="t-anno2">' +
            '<span class="t-tag t-tc">2 · KOMUT</span>' +
            '<span class="t-tag t-tf">3 · FLAG</span>' +
            '<span class="t-tag t-ta">4 · ARGÜMAN</span>' +
          "</div>" +
        "</div>",
      note: "<b>Komut</b> = ne yapılacak · <b>Flag</b> = nasıl yapılacak (ayar) · <b>Argüman</b> = neye yapılacak"
    },
    {
      title: "Prompt'u okumak",
      body: "Satır başındaki yazı sana <b>kim olduğunu ve nerede olduğunu</b> söyler.",
      diagram:
        '<div class="t-prompt-explain">' +
          '<div class="t-pe"><b>engineer</b><span>kullanıcı adın</span></div>' +
          '<div class="t-pe"><b>@cloudquest</b><span>hangi makinedesin</span></div>' +
          '<div class="t-pe"><b>:~</b><span>hangi klasördesin (~ = ev)</span></div>' +
          '<div class="t-pe"><b>$</b><span>“komutunu bekliyorum”</span></div>' +
        "</div>",
      note: "Sen sadece <b>$</b> işaretinden sonrasını yazarsın."
    },
    {
      title: "İlk komutun",
      body: "En zararsız komutla başlayalım: <code>pwd</code> — <i>print working directory</i>.<br>“Şu an hangi klasördeyim?” diye sorar.",
      task: { hint: "pwd", check: function (c) { return /^\s*pwd\s*$/.test(c); },
              why: "Bir sunucuya bağlandığında ilk refleks budur: neredeyim?" }
    },
    {
      title: "Etrafına bak",
      body: "<code>ls</code> (<i>list</i>) bulunduğun klasördeki dosya ve klasörleri gösterir.<br>Sonunda <b>/</b> olanlar klasördür.",
      task: { hint: "ls", check: function (c) { return /^\s*ls\s*$/.test(c); },
              why: "ls + pwd ikilisi, yabancı bir sistemde yönünü bulmanın en hızlı yolu." }
    },
    {
      title: "Flag ekle",
      body: "Aynı komuta <code>-l</code> ekle. Flag, komutun davranışını değiştirir:<br>artık izinleri, sahibi ve boyutu da görürsün.",
      task: { hint: "ls -l", check: function (c) { return /^\s*ls\s+-l\s*$/.test(c); },
              why: "Aynı komut + farklı flag = farklı çıktı. Terminalin gücü burada." }
    },
    {
      title: "Bir klasöre gir",
      body: "<code>cd</code> (<i>change directory</i>) klasör değiştirir.<br>Şimdi <b>belgeler</b> klasörüne gir.",
      task: { hint: "cd belgeler", check: function (c) { return /^\s*cd\s+belgeler\/?\s*$/.test(c); },
              why: "Prompt'un değiştiğine dikkat et: ~ yerine ~/belgeler yazıyor." }
    },
    {
      title: "Dosya oku",
      body: "<code>cat</code> bir dosyanın içeriğini ekrana basar.<br><b>notlar.txt</b> dosyasını oku.",
      task: { hint: "cat notlar.txt", check: function (c) { return /^\s*cat\s+notlar\.txt\s*$/.test(c); },
              why: "Sunucuda log ve config dosyalarını böyle okursun." }
    },
    {
      title: "Geri dön",
      body: "<code>..</code> “bir üst klasör” demektir. <code>cd ..</code> ile geri çık.",
      task: { hint: "cd ..", check: function (c) { return /^\s*cd\s+\.\.\s*$/.test(c); },
              why: "~ = ev klasörün, .. = bir üst, . = bulunduğun yer." }
    },
    {
      title: "Bir şey oluştur",
      body: "<code>mkdir</code> yeni klasör açar. Kendine bir <b>projeler</b> klasörü oluştur.",
      task: { hint: "mkdir projeler", check: function (c) { return /^\s*mkdir\s+projeler\s*$/.test(c); },
              why: "Sonra 'ls' ile kontrol edebilirsin — gerçekten oluştu." }
    },
    {
      title: "Hata yapmak serbest",
      body: "Şimdi bilerek <b>olmayan bir komut</b> yaz (ör. <code>bloop</code>).<br>Terminal seni azarlamaz, sadece bilmediğini söyler.",
      task: { hint: "bloop", check: function (c) { return c.trim().length > 0 && !/^\s*(pwd|ls|cd|cat|mkdir|echo|clear|help)\b/.test(c); },
              why: "Hata mesajı düşman değil, ipucudur. Okumayı öğrenmek işin yarısı." }
    }
  ];

  /* ---------------- durum ---------------- */
  let step = 0, done = false, onFinish = null;
  let outEl, inputEl, stepsEl, progEl, cntEl;

  function print(text, cls) {
    if (text === "" || text == null) return;
    var d = document.createElement("div");
    d.className = "t-out" + (cls ? " " + cls : "");
    d.textContent = text;
    outEl.appendChild(d);
    outEl.scrollTop = outEl.scrollHeight;
  }
  function printPrompt(cmd) {
    var d = document.createElement("div");
    d.className = "t-out t-echo";
    d.innerHTML = '<span class="t-p">engineer@cloudquest:' + shortCwd() + "$</span> " +
                  String(cmd).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    outEl.appendChild(d);
  }
  function updatePromptLabel() {
    var lbl = document.getElementById("t-prompt");
    if (lbl) lbl.textContent = "engineer@cloudquest:" + shortCwd() + "$";
  }

  function renderLesson() {
    var l = LESSONS[step];
    stepsEl.innerHTML =
      '<div class="t-kicker">ADIM ' + (step + 1) + " / " + LESSONS.length + "</div>" +
      "<h2>" + l.title + "</h2>" +
      "<p>" + l.body + "</p>" +
      (l.diagram || "") +
      (l.note ? '<div class="t-note">' + l.note + "</div>" : "") +
      (l.task
        ? '<div class="t-task">Şunu yaz: <code>' + l.task.hint + "</code></div>"
        : '<button class="btn-neon t-next" id="t-next">Anladım, devam →</button>');
    progEl.style.width = Math.round(step / LESSONS.length * 100) + "%";
    cntEl.textContent = (step + 1) + " / " + LESSONS.length;
    var nb = document.getElementById("t-next");
    if (nb) nb.onclick = advance;
    updatePromptLabel();
  }

  function advance() {
    step++;
    if (step >= LESSONS.length) return finish();
    renderLesson();
  }

  function finish() {
    done = true;
    progEl.style.width = "100%";
    cntEl.textContent = LESSONS.length + " / " + LESSONS.length;
    stepsEl.innerHTML =
      '<div class="t-kicker">TAMAMLANDI</div>' +
      "<h2>Artık terminal konuşuyorsun 🎉</h2>" +
      "<p>Komut, flag, argüman, klasör gezme, dosya okuma — hepsi tamam.<br>" +
      "Bunlar bulut mühendisliğinin <b>tamamının</b> üzerine kurulduğu temeldir.</p>" +
      '<div class="t-badge">' + BADGE + "</div>" +
      '<div class="t-actions">' +
        '<a class="btn-neon" href="index.html">🚀 Oyuna başla</a>' +
        '<button class="btn-ghost" id="t-restart" type="button">↻ Baştan al</button>' +
      "</div>";
    var rb = document.getElementById("t-restart");
    if (rb) rb.onclick = restart;
    print("", "");
    print("✔ Öğreticiyi tamamladın. Serbest kullanmaya devam edebilirsin.", "t-ok");
    if (typeof FX !== "undefined") FX.burstCenter({ count: 36 });
    if (onFinish) onFinish(BADGE);
  }

  function restart() {
    FS = freshFS(); cwd = "/home/engineer"; step = 0; done = false;
    outEl.innerHTML = "";
    print("Terminal sıfırlandı. Baştan başlıyoruz.", "t-dim");
    renderLesson();
  }

  function submit(raw) {
    printPrompt(raw);
    var res = runCommand(raw);
    if (res && res.clear) { outEl.innerHTML = ""; }
    else if (res) print(res.out, res.err ? "t-err" : "");
    updatePromptLabel();

    var l = LESSONS[step];
    if (!done && l && l.task && l.task.check(raw)) {
      print("✔ Doğru! " + l.task.why, "t-ok");
      setTimeout(advance, 400);
    }
  }

  function mount(root, opts) {
    opts = opts || {};
    onFinish = opts.onFinish || null;
    outEl = root.querySelector("#t-output");
    inputEl = root.querySelector("#t-input");
    stepsEl = root.querySelector("#t-lesson");
    // İlerleme çubuğu ve sayaç header'da, yani root'un dışında — document'ten al.
    progEl = document.getElementById("t-progress-fill");
    cntEl = document.getElementById("t-counter");
    if (!outEl || !inputEl || !stepsEl || !progEl || !cntEl) {
      console.error("Tutorial: gerekli DOM öğeleri bulunamadı"); return;
    }

    print("CloudQuest Terminal 101 — güvenli alıştırma ortamı.", "t-dim");
    print("Buradaki hiçbir komut gerçek bilgisayarına dokunmaz. Rahat ol.", "t-dim");
    print("", "");
    renderLesson();

    inputEl.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var v = inputEl.value;
      inputEl.value = "";
      if (v.trim()) submit(v);
    });
    root.addEventListener("click", function (e) {
      if (e.target.closest(".t-term")) inputEl.focus();
    });
    inputEl.focus();
  }

  return { mount: mount, BADGE: BADGE, steps: LESSONS.length };
})();
