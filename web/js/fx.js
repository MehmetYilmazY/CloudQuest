/* =========================================================================
   CloudQuest — FX: mikro-etkileşimler ve kutlamalar
   -------------------------------------------------------------------------
   ui-ux-pro-max motion kılavuzuna göre ayarlandı:
   • Buton hover: yer değiştirme < 2px (hareket değil, geri bildirim)
   • Kart hover: y-4 / scale 1.02 / 200-300ms, mouseleave'de aynı özellikler geri
   • Magnetic: imleci 0.3 katsayıyla takip, elastic easing
   • Sayfa geçişi: 200-300ms fade
   • prefers-reduced-motion: tüm hareket kapanır
   Not: Daktilo efekti metni DOM'a TAM olarak yazar (karakterler span'lere
   bölünür, görsel olarak sırayla belirir) — textContent bozulmaz, erişilebilirlik
   ve testler etkilenmez.
   ========================================================================= */
var FX = (function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- daktilo ---------- */
  function typewrite(el, opts) {
    if (reduce || !el) return;
    var text = el.textContent;
    if (!text || text.length > 240) return;          // çok uzun satırı bölme
    var perChar = (opts && opts.perChar) || 11;
    var maxDelay = (opts && opts.maxDelay) || 850;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement("span");
      s.className = "fx-tw";
      s.textContent = text[i];
      s.style.animationDelay = Math.min(i * perChar, maxDelay) + "ms";
      frag.appendChild(s);
    }
    el.textContent = "";
    el.appendChild(frag);
  }

  /* ---------- konfeti / patlama ---------- */
  function burst(x, y, opts) {
    if (reduce) return;
    opts = opts || {};
    var n = opts.count || 28;
    var colors = opts.colors || ["#22d3ee", "#c084fc", "#4ade80", "#fbbf24", "#f472b6"];
    var layer = document.getElementById("fx-layer");
    if (!layer) { layer = document.createElement("div"); layer.id = "fx-layer"; document.body.appendChild(layer); }
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i");
      p.className = "fx-particle";
      var ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.5;
      var dist = 130 + Math.random() * 190;
      var size = 12 + Math.random() * 12;              // 12–24px, değişken
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--s", size + "px");
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist - 60) + "px");
      // bazıları kare, bazıları yuvarlak — daha canlı görünür
      if (i % 3 === 0) p.style.borderRadius = "50%";
      p.style.animationDelay = (Math.random() * 70) + "ms";
      layer.appendChild(p);
      (function (node) { setTimeout(function () { node.remove(); }, 1400); })(p);
    }
  }
  function burstFrom(elOrSel, opts) {
    var el = typeof elOrSel === "string" ? document.querySelector(elOrSel) : elOrSel;
    if (!el) return;
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }
  function burstCenter(opts) { burst(window.innerWidth / 2, window.innerHeight * 0.42, opts); }

  /* ---------- sayı sayacı ---------- */
  function countUp(el, to, opts) {
    if (!el) return;
    var suffix = (opts && opts.suffix) || "";
    var from = parseInt(String(el.textContent).replace(/[^\d-]/g, ""), 10);
    if (isNaN(from)) from = 0;
    if (reduce || from === to) { el.textContent = to + suffix; return; }
    var dur = (opts && opts.duration) || 520, t0 = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);                 // easeOutCubic
      el.textContent = Math.round(from + (to - from) * e) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- kart eğimi (3D tilt) ---------- */
  function tilt(el, strength) {
    if (reduce || !el || el.__fxTilt) return;
    el.__fxTilt = true;
    strength = strength || 7;
    el.classList.add("fx-tilt");
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(800px) rotateX(" + (-py * strength) + "deg) rotateY(" +
                           (px * strength) + "deg) translateY(-4px) scale(1.02)";
      el.style.setProperty("--mx", ((px + 0.5) * 100) + "%");
      el.style.setProperty("--my", ((py + 0.5) * 100) + "%");
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }

  /* ---------- manyetik buton ---------- */
  function magnetic(el, factor) {
    if (reduce || !el || el.__fxMag) return;
    el.__fxMag = true;
    factor = factor || 0.25;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * factor) + "px," +
                                          ((e.clientY - r.top - r.height / 2) * factor) + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }

  /* ---------- ekran geçişi ---------- */
  function screenSwap(fn) {
    if (reduce) { fn(); return; }
    var v = document.getElementById("fx-veil");
    if (!v) { v = document.createElement("div"); v.id = "fx-veil"; document.body.appendChild(v); }
    v.classList.add("on");
    setTimeout(function () {
      fn();
      setTimeout(function () { v.classList.remove("on"); }, 30);
    }, 190);
  }

  /* ---------- level-up afişi ---------- */
  function levelUp(level, rank) {
    if (reduce) return;
    var b = document.createElement("div");
    b.className = "fx-levelup";
    b.innerHTML = '<div class="fx-lu-in"><span class="fx-lu-star">⭐</span>' +
                  '<b>LEVEL ' + level + "</b><em>" + String(rank || "") + "</em></div>";
    document.body.appendChild(b);
    burstCenter({ count: 34 });
    setTimeout(function () { b.classList.add("out"); }, 1500);
    setTimeout(function () { b.remove(); }, 2100);
  }

  /* ---------- arka plan zerrecikleri (canvas) ----------
     Tek canvas, tek rAF döngüsü. Sekme gizliyken durur (pil dostu),
     reduced-motion'da hiç başlamaz. İçeriğin arkasında, tıklamayı engellemez. */
  var _pt = null;
  function particles(opts) {
    if (reduce || _pt) return;
    opts = opts || {};
    var cv = document.createElement("canvas");
    cv.id = "fx-particles";
    document.body.appendChild(cv);
    var ctx = cv.getContext("2d", { alpha: true });
    var W = 0, H = 0, dpr = 1, pts = [], raf = null, running = false;
    var mouse = { x: -9999, y: -9999 };
    var COLORS = ["34,211,238", "192,132,252", "74,222,128"];
    var LINK = opts.link || 132;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // yoğunluk ekran alanına göre, üst sınırla (mobilde daha az)
      var target = Math.min(opts.max || 78, Math.round((W * H) / 17000));
      while (pts.length < target) pts.push(spawn());
      if (pts.length > target) pts.length = target;
    }
    function spawn() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.06 + Math.random() * 0.20),          // hafif yukarı sürüklenme
        r: 0.9 + Math.random() * 2.0,
        a: 0.45 + Math.random() * 0.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        tw: Math.random() * Math.PI * 2               // parıldama fazı
      };
    }
    // Akan dalgalar — zerreciklerle AYNI canvas'a, altta. Ayrı bir animasyon
    // katmanı açmamak için: tek rAF, ek maliyet yok.
    var WAVES = [
      { amp: 28, len: 0.0030, spd: 0.00022, y: 0.70, c: "34,211,238",  a: 0.10 },
      { amp: 36, len: 0.0019, spd: -0.00015, y: 0.79, c: "192,132,252", a: 0.085 },
      { amp: 20, len: 0.0042, spd: 0.00031, y: 0.88, c: "74,222,128",  a: 0.055 }
    ];
    function drawWaves(t) {
      for (var w = 0; w < WAVES.length; w++) {
        var v = WAVES[w], base = H * v.y;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (var x = 0; x <= W; x += 8) {
          var y = base + Math.sin(x * v.len + t * v.spd) * v.amp
                       + Math.sin(x * v.len * 2.3 + t * v.spd * 1.7) * (v.amp * 0.35);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.closePath();
        var g = ctx.createLinearGradient(0, base - v.amp, 0, H);
        g.addColorStop(0, "rgba(" + v.c + "," + v.a + ")");
        g.addColorStop(1, "rgba(" + v.c + ",0)");
        ctx.fillStyle = g; ctx.fill();
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      drawWaves(performance.now());

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;

        // imleçten hafif kaçınma (etkileşim hissi)
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000 && d2 > 0.01) {
          var f = (14000 - d2) / 14000 * 0.6, d = Math.sqrt(d2);
          p.x += (dx / d) * f; p.y += (dy / d) * f;
        }

        // sarmalama
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;

        var alpha = p.a * (0.72 + 0.28 * Math.sin(p.tw));
        // yumuşak hâle (glow) — shadowBlur'dan ucuz
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, "rgba(" + p.c + "," + alpha.toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + p.c + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
        // çekirdek
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = "rgba(" + p.c + "," + Math.min(1, alpha + 0.25).toFixed(3) + ")";
        ctx.fill();
      }

      // yakın komşuları bağla (takımyıldız etkisi)
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var ax = pts[a].x - pts[b].x, ay = pts[a].y - pts[b].y;
          var dist = Math.sqrt(ax * ax + ay * ay);
          if (dist > LINK) continue;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.strokeStyle = "rgba(56,189,248," + (0.22 * (1 - dist / LINK)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running) return; running = true; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("mouseout", function () { mouse.x = mouse.y = -9999; }, { passive: true });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

    resize(); start();
    _pt = { start: start, stop: stop, resize: resize, canvas: cv };
    return _pt;
  }

  function autoWire(root) {
    (root || document).querySelectorAll(".lab-card, .story-card, .g-card, .g-block").forEach(function (c) { tilt(c); });
  }

  return {
    reduce: reduce, typewrite: typewrite, burst: burst, burstFrom: burstFrom, burstCenter: burstCenter,
    countUp: countUp, tilt: tilt, magnetic: magnetic, screenSwap: screenSwap, levelUp: levelUp,
    autoWire: autoWire, particles: particles
  };
})();

/* ---------------------------------------------------------------------------
   ZEMİN AMBİYANSI ARTIK YILDIZ ALANI (js/stars.js).

   Eskiden burada FX.particles() otomatik başlatılıyordu: yukarı süzülen
   zerrecikler + alt kenarda akan dalgalar. İkisi de güzeldi ama uzay dili
   değildi — dalgalar su/ses çağrıştırıyor, zerreciklerin bağlantı çizgileri
   ağ grafiği gibi duruyordu. Site geneli tek bir gökyüzüne geçince
   (landing, ders sayfaları, 404, uygulama) bu katman devre dışı bırakıldı.

   FX.particles() SİLİNMEDİ — geri dönmek istersen aşağıdaki satırı aç.
   Ama yıldızlarla aynı anda çalıştırma: iki ayrı derinlik hissi çakışıyor.
--------------------------------------------------------------------------- */
// (function () {
//   function go() { if (typeof FX !== "undefined") FX.particles(); }
//   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
//   else go();
// })();
