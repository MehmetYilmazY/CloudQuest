/* =========================================================================
   CloudQuest — Yıldız alanı (site geneli zemin)
   -------------------------------------------------------------------------
   Sayfada <canvas id="stars"> varsa kendi kendine başlar. Bağımlılık yok.

   Neden canvas: 230 yıldızı DOM elemanı olarak sürüklemek telefonda
   kekliyor; tek canvas'ta çizmek hem akıcı hem düşük bellek.

   Derinlik ÜÇ KATMANDAN doğuyor: uzaktakiler küçük/sönük/yavaş, yakındakiler
   büyük/parlak/hızlı. Tek katman düz bir duvar gibi durur, uzay hissi vermez.

   prefers-reduced-motion açıksa yıldızlar çizilir ama HAREKET ETMEZ —
   zemin yine dolu görünür, hareket rahatsızlığı olmaz.
   Sekme arkaplandayken döngü durur: görünmeyen animasyon pil yakmasın.
   ========================================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("stars");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var LAYERS = [
    { count: 130, speed: 0.010, size: [0.4, 0.9], alpha: [0.18, 0.42] },
    { count: 70,  speed: 0.026, size: [0.7, 1.4], alpha: [0.35, 0.68] },
    { count: 26,  speed: 0.055, size: [1.1, 2.0], alpha: [0.6,  0.95] }
  ];
  /* Hafif renk farkı: gerçek gökyüzünde de yıldızlar saf beyaz değil. */
  var TINTS = ["255,255,255", "190,225,255", "215,200,255"];

  var stars = [];
  var w = 0, h = 0, dpr = 1, running = false;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    stars = [];
    LAYERS.forEach(function (layer) {
      // Yıldız sayısı ekran alanıyla ölçekli: telefonda 230 yıldız israf.
      var scale = Math.min(1.6, Math.max(0.42, (w * h) / (1440 * 900)));
      var n = Math.round(layer.count * scale);
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(layer.size[0], layer.size[1]),
          a: rand(layer.alpha[0], layer.alpha[1]),
          s: layer.speed,
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          // Her yıldız kendi ritminde parlasın; hepsi aynı anda yanıp sönerse sahte durur.
          tw: Math.random() * Math.PI * 2,
          tws: rand(0.006, 0.02)
        });
      }
    });
  }

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);   // 3x ekranda 3x piksel gereksiz
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = s.a;

      if (!reduced) {
        s.x -= s.s;                                  // sağdan sola süzülme
        if (s.x < -2) { s.x = w + 2; s.y = Math.random() * h; }
        s.tw += s.tws;
        alpha = s.a * (0.72 + 0.28 * Math.sin(s.tw));
      }

      ctx.fillStyle = "rgba(" + s.tint + "," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
    else running = false;                            // tek kare çiz, dur
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  resize();
  start();

  /* Sekme görünmezken çizmeyi bırak — arka planda pil yakmanın anlamı yok. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); start(); }, 160);
  }, { passive: true });
})();
