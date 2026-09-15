/* =========================================================================
   CloudQuest — Landing etkileşimleri
   -------------------------------------------------------------------------
   Bağımlılık yok, ~3KB. Bilerek AZ efekt var: imleç ışığı, manyetik düğme,
   sayaç, metin scramble ve scroll çubuğu kaldırıldı — hepsi ürünle ilgisiz
   "şablon" hissi veriyordu. Kalanlar ürünü kanıtlıyor:

     1. yazan terminal  -> "canlı terminal" iddiasının görsel karşılığı
     2. komut şeridi    -> müfredatın gerçekten kapsadığı komutlar
     3. kısa reveal     -> okuma ritmi (12px, 0.5s; fark edilmeden çalışır)

   prefers-reduced-motion altında hiçbiri çalışmaz.
   ========================================================================= */
(function () {
  "use strict";

  var P = I18N.phrase;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------------------------------------------------- nav durumu */
  var nav = $("nav"), ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle("scrolled", document.documentElement.scrollTop > 8);
      ticking = false;
    });
  }, { passive: true });

  /* -------------------------------------------------------------- reveal */
  var revealables = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("seen"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("seen");
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  var heroTitle = $("heroTitle");
  if (heroTitle) {
    if (reduced) heroTitle.classList.add("in");
    else requestAnimationFrame(function () {
      setTimeout(function () { heroTitle.classList.add("in"); }, 100);
    });
  }

  /* =======================================================================
     TERMİNAL — gerçek quest c1q1 akışı
     ======================================================================= */
  var SCRIPT = [
    { cls: "c-mentor", text: P("[Nova]: Bu prod sunucusunda yön bulmayı öğrenelim.") },
    { cls: "c-info",   text: P("görev 1/4 — nerede olduğunu öğren") },
    { cmd: "pwd" },
    { cls: "c-ok",     text: P("/home/engineer dizinindesin.") },
    { cls: "c-info",   text: P("görev 2/4 — dosyaları listele") },
    { cmd: "ls -la" },
    { cls: "c-ok",     text: "deploy/   logs/   README.md" },
    { cls: "c-info",   text: P("görev 3/4 — deploy.sh'ı çalıştırılabilir yap") },
    { cmd: "chmod +x deploy/deploy.sh" },
    { cls: "c-ok",     text: P("artık çalıştırılabilir.") },
    { cls: "c-xp",     text: P("+60 XP   +15 kredi   rozet: First Login") },
    { cls: "c-mentor", text: P("[Nova]: Terminal artık düşmanın değil, aletin.") }
  ];

  var termBody = $("termBody");
  if (termBody) {
    if (reduced) {
      SCRIPT.forEach(function (s) {
        var d = document.createElement("div");
        d.className = "l " + (s.cmd ? "c-cmd" : s.cls);
        d.textContent = s.cmd ? "engineer@meridian:~$ " + s.cmd : s.text;
        termBody.appendChild(d);
      });
    } else {
      playTerminal();
    }
  }

  function playTerminal() {
    var i = 0;

    function step() {
      if (i >= SCRIPT.length) {
        setTimeout(function () { termBody.innerHTML = ""; i = 0; step(); }, 3400);
        return;
      }
      var s = SCRIPT[i++];
      if (s.cmd) typeCommand(s.cmd, step);
      else { printLine(s.cls, s.text); setTimeout(step, 540); }
    }

    function printLine(cls, text) {
      var d = document.createElement("div");
      d.className = "l " + cls;
      d.textContent = text;
      termBody.appendChild(d);
      trim();
    }

    /* Harf harf yazar. Sabit hız robotik durduğu için gecikme düzensiz. */
    function typeCommand(cmd, done) {
      var line = document.createElement("div");
      line.className = "l";
      var prompt = document.createElement("span");
      prompt.className = "c-prompt";
      prompt.textContent = "engineer@meridian:~$ ";
      var typed = document.createElement("span");
      typed.className = "c-cmd";
      var caret = document.createElement("span");
      caret.className = "caret";
      line.append(prompt, typed, caret);
      termBody.appendChild(line);
      trim();

      var k = 0;
      (function tick() {
        if (k >= cmd.length) { caret.remove(); setTimeout(done, 460); return; }
        typed.textContent += cmd[k++];
        setTimeout(tick, 40 + Math.random() * 55);
      })();
    }

    /* Kutu sabit yükseklikte: taşan en eski satır düşer, sayfa zıplamaz. */
    function trim() {
      while (termBody.children.length > 14) termBody.removeChild(termBody.firstChild);
    }

    step();
  }

  /* =======================================================================
     TICKER — müfredatta gerçekten geçen komutlar
     İki özdeş şerit: biri çıkarken diğeri giriyor, kesinti olmuyor.
     ======================================================================= */
  var COMMANDS = [
    "pwd", "ls -la", "chmod +x", "grep -r", "tail -f", "ps aux", "systemctl status",
    "ssh -i key.pem", "curl -I", "dig +short", "ss -tulpn", "tcpdump -i eth0",
    "git switch -c", "git rebase -i", "aws s3 sync", "aws iam create-role",
    "terraform plan", "terraform apply", "docker build -t", "docker compose up",
    "kubectl get pods", "kubectl logs -f", "helm upgrade", "ansible-playbook",
    "trivy image", "openssl x509", "crontab -e", "awk '{print $1}'"
  ];
  function fill(el) {
    if (!el) return;
    el.innerHTML = COMMANDS.map(function (c) {
      return "<span><b>$</b> " + c.replace(/</g, "&lt;") + "</span>";
    }).join("");
  }
  fill($("tk1"));
  fill($("tk2"));
})();
