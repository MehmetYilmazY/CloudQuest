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

  var P = I18N.phrase;
  var T = I18N.t;

  /* Sanal dosya sisteminin ADLARI da dile bağlı: İngilizce oynayan biri
     "cd belgeler" yazmak zorunda kalmasın. Adlar TEK yerde tanımlı; hem
     dosya sistemi hem adım kontrolleri buradan besleniyor. İkisi ayrışırsa
     öğretici çözülemez hâle gelir — bu yüzden elle tekrarlanmıyor. */
  var N = I18N.lang === "tr"
    ? { docs: "belgeler", dl: "indirilenler", hello: "merhaba.txt",
        notes: "notlar.txt", plan: "plan.txt", setup: "kurulum.sh", projects: "projeler" }
    : { docs: "documents", dl: "downloads", hello: "hello.txt",
        notes: "notes.txt", plan: "plan.txt", setup: "setup.sh", projects: "projects" };

  /* ---------------- sanal dosya sistemi ---------------- */
  function freshFS() {
    var fs = {};
    fs["/home/engineer"] = { type: "dir", children: [N.docs, N.dl, N.hello] };
    fs["/home/engineer/" + N.docs] = { type: "dir", children: [N.notes, N.plan] };
    fs["/home/engineer/" + N.dl] = { type: "dir", children: [N.setup] };
    fs["/home/engineer/" + N.hello] = { type: "file", body: P("Merhaba! Bu bir metin dosyası.\nTerminalden okundun. 👋") };
    fs["/home/engineer/" + N.docs + "/" + N.notes] = { type: "file", body: P("- terminal öğren\n- bulut öğren\n- işi kap") };
    fs["/home/engineer/" + N.docs + "/" + N.plan] = { type: "file", body: P("Hafta 1: Linux\nHafta 2: Ağ + Git\nHafta 3: AWS") };
    fs["/home/engineer/" + N.dl + "/" + N.setup] = { type: "file", body: "#!/bin/bash\necho 'setup started'" };
    return fs;
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
        if (!node) return { out: T("tut.ls.nofile", { name: args[0] || "" }), err: true };
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
        if (!FS[dest]) return { out: T("tut.cd.nodir", { name: args[0] || "" }), err: true };
        if (FS[dest].type !== "dir") return { out: T("tut.cd.notdir", { name: args[0] }), err: true };
        cwd = dest; return { out: "" };
      }
      case "cat": {
        if (!args[0]) return { out: T("tut.cat.which", { example: N.hello }), err: true };
        var f = resolve(args[0]);
        if (!FS[f]) return { out: T("tut.cat.nofile", { name: args[0] }), err: true };
        if (FS[f].type === "dir") return { out: T("tut.cat.isdir", { name: args[0] }), err: true };
        return { out: FS[f].body };
      }
      case "mkdir": {
        if (!args[0]) return { out: T("tut.mkdir.needName", { example: N.projects }), err: true };
        var np = resolve(args[0]);
        if (FS[np]) return { out: T("tut.mkdir.exists", { name: args[0] }), err: true };
        FS[np] = { type: "dir", children: [] };
        FS[cwd].children.push(args[0]);
        return { out: "" };
      }
      case "echo": return { out: t.slice(4).trim().replace(/^["']|["']$/g, "") };
      case "clear": return { clear: true };
      case "help": return { out: T("tut.help") };
      default:
        return { out: T("tut.unknown", { cmd: cmd }), err: true };
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
          '<div class="t-anno"><span class="t-tag">1 · PROMPT</span><span class="t-desc">' +
            T("tut.anat.prompt") + "</span></div>" +
          '<div class="t-line"><b class="t-p">engineer@cloudquest:~$</b> <span class="t-c">ls</span> <span class="t-f">-l</span> <span class="t-a">' + N.docs + "</span></div>" +
          '<div class="t-anno2">' +
            '<span class="t-tag t-tc">2 · ' + T("tut.anat.command") + "</span>" +
            '<span class="t-tag t-tf">3 · FLAG</span>' +
            '<span class="t-tag t-ta">4 · ' + T("tut.anat.argument") + "</span>" +
          "</div>" +
        "</div>",
      note: "<b>Komut</b> = ne yapılacak · <b>Flag</b> = nasıl yapılacak (ayar) · <b>Argüman</b> = neye yapılacak"
    },
    {
      title: "Prompt'u okumak",
      body: "Satır başındaki yazı sana <b>kim olduğunu ve nerede olduğunu</b> söyler.",
      diagram:
        '<div class="t-prompt-explain">' +
          '<div class="t-pe"><b>engineer</b><span>' + T("tut.prompt.user") + "</span></div>" +
          '<div class="t-pe"><b>@cloudquest</b><span>' + T("tut.prompt.host") + "</span></div>" +
          '<div class="t-pe"><b>:~</b><span>' + T("tut.prompt.cwd") + "</span></div>" +
          '<div class="t-pe"><b>$</b><span>' + T("tut.prompt.dollar") + "</span></div>" +
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
      body: P("<code>cd</code> (<i>change directory</i>) klasör değiştirir.<br>Şimdi <b>{dir}</b> klasörüne gir.").replace("{dir}", N.docs),
      task: { hint: "cd " + N.docs, check: function (c) { return new RegExp("^\\s*cd\\s+" + N.docs + "/?\\s*$").test(c); },
              why: P("Prompt'un değiştiğine dikkat et: ~ yerine ~/{dir} yazıyor.").replace("{dir}", N.docs) }
    },
    {
      title: "Dosya oku",
      body: P("<code>cat</code> bir dosyanın içeriğini ekrana basar.<br><b>{file}</b> dosyasını oku.").replace("{file}", N.notes),
      task: { hint: "cat " + N.notes, check: function (c) { return new RegExp("^\\s*cat\\s+" + N.notes.replace(".", "\\.") + "\\s*$").test(c); },
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
      body: P("<code>mkdir</code> yeni klasör açar. Kendine bir <b>{dir}</b> klasörü oluştur.").replace("{dir}", N.projects),
      task: { hint: "mkdir " + N.projects, check: function (c) { return new RegExp("^\\s*mkdir\\s+" + N.projects + "\\s*$").test(c); },
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
      '<div class="t-kicker">' + T("tut.step", { n: step + 1, total: LESSONS.length }) + "</div>" +
      "<h2>" + P(l.title) + "</h2>" +
      "<p>" + P(l.body) + "</p>" +
      (l.diagram || "") +
      (l.note ? '<div class="t-note">' + P(l.note) + "</div>" : "") +
      (l.task
        ? '<div class="t-task">' + T("tut.typeThis") + " <code>" + l.task.hint + "</code></div>"
        : '<button class="btn-neon t-next" id="t-next">' + T("tut.gotIt") + "</button>");
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
      '<div class="t-kicker">' + T("tut.doneKicker") + "</div>" +
      "<h2>" + T("tut.doneTitle") + "</h2>" +
      "<p>" + T("tut.doneBody") + "</p>" +
      '<div class="t-badge">' + BADGE + "</div>" +
      '<div class="t-actions">' +
        '<a class="btn-neon" href="app.html">' + T("tut.playCta") + "</a>" +
        '<button class="btn-ghost" id="t-restart" type="button">' + T("tut.restart") + "</button>" +
      "</div>";
    var rb = document.getElementById("t-restart");
    if (rb) rb.onclick = restart;
    print("", "");
    print(T("tut.freeplay"), "t-ok");
    if (typeof FX !== "undefined") FX.burstCenter({ count: 36 });
    if (onFinish) onFinish(BADGE);
  }

  function restart() {
    FS = freshFS(); cwd = "/home/engineer"; step = 0; done = false;
    outEl.innerHTML = "";
    print(T("tut.reset"), "t-dim");
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
      print(T("tut.correct") + " " + P(l.task.why), "t-ok");
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

    print(T("tut.intro1"), "t-dim");
    print(T("tut.intro2"), "t-dim");
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
