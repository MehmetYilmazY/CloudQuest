/* =========================================================================
   CloudQuest — 404 sayfası: kayıp rota teşhisi
   -------------------------------------------------------------------------
   Yıldız zemini artık site geneli (js/stars.js). Burada kalan tek iş:
   hangi adrese gelindiğini göstermek ve TAHMİN YÜRÜTMEK — /komut/ altında
   kaybolduysan komut sözlüğüne yollar. 404 sayfasının işi özür dilemek
   değil, kullanıcıyı gideceği yere ulaştırmak.
   ========================================================================= */
(function () {
  "use strict";

  /* =======================================================================
     KAYIP ROTA TEŞHİSİ
     ======================================================================= */
  var pathEl = document.getElementById("void-path");
  var hintEl = document.getElementById("void-hint");
  var path = location.pathname + location.search;

  if (pathEl) {
    // Metin olarak basıyoruz (innerHTML değil): adres çubuğundan gelen
    // içerik güvenilmezdir, sayfaya HTML olarak enjekte edilmemeli.
    pathEl.textContent = path.length > 120 ? path.slice(0, 120) + "…" : path;
  }

  /* Nerede kaybolduğuna göre en yakın limanı öner. */
  if (hintEl) {
    var suggestion = null;
    if (/^\/komut\//.test(path))      suggestion = { url: "/komut", label: "komut sözlüğü" };
    else if (/^\/ogren\//.test(path)) suggestion = { url: "/ogren", label: "ders sayfaları" };
    else if (/^\/(app|oyun|login|giris)/i.test(path)) suggestion = { url: "/app", label: "terminal" };

    if (suggestion) {
      hintEl.innerHTML =
        "Buraya yakın bir yer arıyorsan: " +
        '<a href="' + suggestion.url + '">' + suggestion.label + "</a>.";
      hintEl.hidden = false;
    }
  }
})();
