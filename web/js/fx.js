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
      var dist = 90 + Math.random() * 130;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist - 40) + "px");
      p.style.animationDelay = (Math.random() * 60) + "ms";
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

  function autoWire(root) {
    (root || document).querySelectorAll(".lab-card, .story-card, .g-card, .g-block").forEach(function (c) { tilt(c); });
  }

  return {
    reduce: reduce, typewrite: typewrite, burst: burst, burstFrom: burstFrom, burstCenter: burstCenter,
    countUp: countUp, tilt: tilt, magnetic: magnetic, screenSwap: screenSwap, levelUp: levelUp, autoWire: autoWire
  };
})();
