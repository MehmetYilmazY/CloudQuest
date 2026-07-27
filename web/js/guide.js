/* =========================================================================
   CloudQuest — Başlangıç Rehberi (scroll-driven, ADHD-dostu)
   -------------------------------------------------------------------------
   Tasarım ilkeleri:
   • Ekran başına TEK fikir, en fazla 2 kısa cümle (bilişsel yük düşük)
   • Her zaman görünür ilerleme (üstte bar + "3/10") — bitişin nerede olduğu belli
   • Apple tarzı scroll reveal: IntersectionObserver + CSS geçişi
     (küçük y offset'i 8-16px → kayma değil, yumuşak beliriş)
   • Metne parallax YOK (okuma konforunu bozar), yalnız dekoratif katmanlara
   • prefers-reduced-motion desteklenir
   İçerik roadmap.sh (cloud/devops) temel alınarak hazırlandı.
   ========================================================================= */
var Guide = (function () {
  "use strict";

  const BADGE = "🧭 Yol Bulucu";

  const SECTIONS = [
    {
      kicker: "BAŞLANGIÇ REHBERİ",
      title: "Cloud Engineer\nnasıl olunur?",
      lines: ["6 dakika. Sıfır ön bilgi.", "Kaydır ↓"],
      visual: '<div class="g-hero-orb"></div>',
      hero: true
    },
    {
      kicker: "01 — TEMEL",
      title: "Bulut nedir?",
      lines: ["Başkasının bilgisayarı.", "Ama kiralık, sınırsız ve 30 saniyede hazır."],
      visual:
        '<div class="g-compare">' +
          '<div class="g-compare-item"><div class="g-big">🖥️</div><b>Eskiden</b><span>Sunucu satın al, veri merkezine koy, 6 hafta bekle</span></div>' +
          '<div class="g-arrow">→</div>' +
          '<div class="g-compare-item g-hl"><div class="g-big">☁️</div><b>Şimdi</b><span>Tek komut. 30 saniye. Kullandığın kadar öde</span></div>' +
        '</div>'
    },
    {
      kicker: "02 — MODELLER",
      title: "IaaS · PaaS · SaaS",
      lines: ["Pizza ile düşün: ne kadarını sen yaparsın?"],
      visual:
        '<div class="g-cards">' +
          '<div class="g-card"><div class="g-big">🧑‍🍳</div><b>IaaS</b><span>Malzemeyi alırsın, pizzayı sen yaparsın</span><em>EC2, VPC</em></div>' +
          '<div class="g-card"><div class="g-big">📦</div><b>PaaS</b><span>Hazır hamur gelir, üstünü sen dizersin</span><em>App Runner, Heroku</em></div>' +
          '<div class="g-card"><div class="g-big">🍕</div><b>SaaS</b><span>Pizza kapına gelir, sadece yersin</span><em>Gmail, Slack</em></div>' +
        '</div>',
      note: "Cloud Engineer'ın evi <b>IaaS</b>'tır. Orayı öğreneceksin."
    },
    {
      kicker: "03 — NEDEN",
      title: "Şirketler neden buluta geçti?",
      lines: [],
      visual:
        '<div class="g-stats">' +
          '<div class="g-stat"><div class="g-num">30sn</div><span>Sunucu açma süresi</span></div>' +
          '<div class="g-stat"><div class="g-num">%0</div><span>Peşin donanım maliyeti</span></div>' +
          '<div class="g-stat"><div class="g-num">∞</div><span>Ölçeklenme (trafik patlarsa)</span></div>' +
          '<div class="g-stat"><div class="g-num">7/24</div><span>Bir sunucu ölse bile ayakta</span></div>' +
        '</div>'
    },
    {
      kicker: "04 — YAPI TAŞLARI",
      title: "Her bulut 4 şeyden ibaret",
      lines: ["Hangi sağlayıcı olursa olsun. İsimler değişir, mantık aynı."],
      visual:
        '<div class="g-blocks">' +
          '<div class="g-block"><span class="g-bicon">🔑</span><b>Kimlik</b><em>Kim neye erişebilir<br><code>IAM</code></em></div>' +
          '<div class="g-block"><span class="g-bicon">🌐</span><b>Ağ</b><em>Neyin nereye bağlanacağı<br><code>VPC</code></em></div>' +
          '<div class="g-block"><span class="g-bicon">🖥️</span><b>Hesaplama</b><em>Kodun çalıştığı yer<br><code>EC2</code></em></div>' +
          '<div class="g-block"><span class="g-bicon">🪣</span><b>Depolama</b><em>Verinin durduğu yer<br><code>S3</code></em></div>' +
        '</div>',
      note: "Bu dörtlüyü çözersen bulutun <b>%80'ini</b> çözmüş olursun."
    },
    {
      kicker: "05 — İŞİN GERÇEĞİ",
      title: "Bir Cloud Engineer\ngünde ne yapar?",
      lines: [],
      visual:
        '<div class="g-list">' +
          '<div class="g-li"><span>⌨️</span><div><b>Terminal</b>Günün yarısı burada geçer</div></div>' +
          '<div class="g-li"><span>📝</span><div><b>Altyapıyı kodlar</b>Tıklamaz — Terraform yazar</div></div>' +
          '<div class="g-li"><span>🔁</span><div><b>Otomatikleştirir</b>İki kez yaptıysa, üçüncüsünü script yapar</div></div>' +
          '<div class="g-li"><span>🔍</span><div><b>Arıza çözer</b>"Neden yavaş?" sorusunun peşine düşer</div></div>' +
          '<div class="g-li"><span>💰</span><div><b>Faturaya bakar</b>Sürpriz maliyet kariyerin düşmanı</div></div>' +
        '</div>'
    },
    {
      kicker: "06 — YOL HARİTASI",
      title: "Hangi sırayla öğrenilir?",
      lines: ["Atlama. Her basamak bir öncekinin üstüne biner."],
      visual:
        '<div class="g-steps">' +
          '<div class="g-step"><i>1</i><b>Linux & Terminal</b><em>Bulutun dili</em></div>' +
          '<div class="g-step"><i>2</i><b>Ağ & Git</b><em>Paketler ve versiyon kontrolü</em></div>' +
          '<div class="g-step"><i>3</i><b>Bir bulut (AWS)</b><em>IAM, VPC, EC2, S3, RDS</em></div>' +
          '<div class="g-step"><i>4</i><b>IaC (Terraform)</b><em>Altyapıyı kodla</em></div>' +
          '<div class="g-step"><i>5</i><b>Container (Docker/K8s)</b><em>Paketle ve ölçekle</em></div>' +
          '<div class="g-step"><i>6</i><b>CI/CD & İzleme</b><em>Otomatik dağıt, önden gör</em></div>' +
          '<div class="g-step"><i>7</i><b>Güvenlik & Maliyet</b><em>Seni senior yapan ikili</em></div>' +
        '</div>',
      note: "CloudQuest tam olarak bu sırayı takip eder."
    },
    {
      kicker: "07 — TUZAK",
      title: "En sık yapılan hata",
      lines: [],
      visual:
        '<div class="g-versus">' +
          '<div class="g-bad"><div class="g-big">📚</div><b>Yanlış</b><span>Video izle, sertifika topla, hiç uygulama yapma</span></div>' +
          '<div class="g-good"><div class="g-big">🛠️</div><b>Doğru</b><span>%20 teori, %80 klavye. Kır, düzelt, tekrar kır</span></div>' +
        '</div>',
      note: "İşe alan kişi <b>ne yaptığını</b> sorar, ne izlediğini değil."
    },
    {
      kicker: "08 — TAKTİK",
      title: "ADHD dostu çalışma",
      lines: ["Uzun seans yok. Küçük ve sık.", "Bu oyun da bunun için quest'lere bölündü."],
      visual:
        '<div class="g-tips">' +
          '<div class="g-tip"><b>25 dk</b><span>Tek quest, tek konu. Sonra kalk.</span></div>' +
          '<div class="g-tip"><b>Her gün 1</b><span>3 saat haftada bir\'den iyidir</span></div>' +
          '<div class="g-tip"><b>Görünür ilerleme</b><span>XP ve rozet, beynine "bitti" sinyali verir</span></div>' +
          '<div class="g-tip"><b>Takılınca</b><span>3 kez dene, sonra ipucu al. Utanma yok.</span></div>' +
        '</div>'
    },
    {
      kicker: "HAZIRSIN",
      title: "Artık haritan var.",
      lines: ["Geri kalanı klavyede öğrenilir."],
      visual: '<div class="g-finish"><div class="g-badge-pop">' + BADGE + "</div></div>",
      finish: true
    }
  ];

  let _onComplete = null, _done = false, _io = null;

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function sectionHTML(s, i, total) {
    var titleHtml = esc(s.title).replace(/\n/g, "<br>");
    var lines = (s.lines || []).map(function (l) { return '<p class="g-line">' + esc(l) + "</p>"; }).join("");
    return '' +
      '<section class="g-section' + (s.hero ? " g-hero" : "") + (s.finish ? " g-final" : "") + '" data-idx="' + i + '">' +
        '<div class="g-inner">' +
          '<div class="g-kicker reveal">' + esc(s.kicker) + "</div>" +
          '<h2 class="g-title reveal">' + titleHtml + "</h2>" +
          (lines ? '<div class="reveal">' + lines + "</div>" : "") +
          (s.visual ? '<div class="g-visual reveal">' + s.visual + "</div>" : "") +
          (s.note ? '<div class="g-note reveal">' + s.note + "</div>" : "") +
          (s.hero ? '<div class="g-scrollhint reveal">↓</div>' : "") +
          (s.finish ? '<button class="btn-neon g-cta reveal" id="guide-finish">🚀 Oyuna Başla</button>' : "") +
        "</div>" +
      "</section>";
  }

  function mount(container, opts) {
    opts = opts || {};
    _onComplete = opts.onComplete || null;
    _done = false;

    container.innerHTML =
      '<div class="g-progress"><div class="g-progress-fill" id="g-progress-fill"></div></div>' +
      '<div class="g-counter" id="g-counter">1 / ' + SECTIONS.length + "</div>" +
      '<button class="g-close" id="guide-close" aria-label="kapat">✕</button>' +
      '<div class="g-scroll" id="g-scroll">' +
        SECTIONS.map(function (s, i) { return sectionHTML(s, i, SECTIONS.length); }).join("") +
      "</div>";

    var scroller = container.querySelector("#g-scroll");
    var fill = container.querySelector("#g-progress-fill");
    var counter = container.querySelector("#g-counter");
    var sections = container.querySelectorAll(".g-section");

    // İlerleme çubuğu — ADHD için kritik: bitişin nerede olduğu her an görünür
    scroller.addEventListener("scroll", function () {
      var max = scroller.scrollHeight - scroller.clientHeight;
      var pct = max > 0 ? Math.min(100, Math.round(scroller.scrollTop / max * 100)) : 0;
      fill.style.width = pct + "%";
    }, { passive: true });

    // Scroll reveal (skill verisi: küçük y offset, 'top ~85%' tetikleme)
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Gizleme yalnızca animasyon gerçekten kurulabiliyorsa devreye girer.
    // IO yoksa / hareket azaltma açıksa içerik olduğu gibi görünür kalır.
    if (typeof IntersectionObserver === "function" && !reduce) container.classList.add("g-anim");
    else container.classList.remove("g-anim");
    if (_io) _io.disconnect();
    _io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sec = e.target;
        sec.classList.add("g-in");
        counter.textContent = (parseInt(sec.dataset.idx, 10) + 1) + " / " + SECTIONS.length;
        if (sec.classList.contains("g-final") && !_done) {
          _done = true;
          if (_onComplete) _onComplete(BADGE);
        }
      });
    }, { root: scroller, threshold: reduce ? 0.01 : 0.35 });

    sections.forEach(function (s) { _io.observe(s); });
    if (reduce) container.classList.add("g-reduce");
    scroller.scrollTop = 0;
    fill.style.width = "0%";
    counter.textContent = "1 / " + SECTIONS.length;
    // Hero'yu IO/rAF zamanlamasına bırakma. (Arka plan sekmesinde ya da sayfa
    // frame üretmediğinde rAF hiç çalışmaz; timer çalışır.)
    setTimeout(function () { if (sections[0]) sections[0].classList.add("g-in"); }, 30);
  }

  function unmount() { if (_io) { _io.disconnect(); _io = null; } }

  return { mount: mount, unmount: unmount, BADGE: BADGE, count: SECTIONS.length };
})();
