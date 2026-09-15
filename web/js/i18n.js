/* =========================================================================
   CloudQuest — i18n çalışma zamanı
   -------------------------------------------------------------------------
   İki dil: tr (kaynak) ve en. Metinler iki yerden gelir:

     • ARAYÜZ  -> strings.generated.js  (data/i18n/ui.*.json'dan üretilir)
     • MÜFREDAT-> content.generated.js  (data/curriculum.json + i18n haritası)

   Bu dosya ikisinden de ÖNCE yüklenmelidir: content.generated.js açılışta
   `I18N.lang`e bakıp doğru bundle'ı seçiyor. Sıra bozulursa oyun sessizce
   Türkçeye düşer — hata vermez ama İngilizce seçimi yok sayılır.

   DİL SEÇİMİ (ilk eşleşen kazanır):
     1. ?lang=en          — paylaşılan bağlantı; seçimi kalıcı da yapar
     2. localStorage      — kullanıcının önceki tercihi
     3. <html lang="...">  — sayfanın kendi dili (statik EN sayfaları)
     4. navigator.language — Türkçe olmayan tarayıcı İngilizce görsün

   HTML tarafı: metni Türkçe yazmaya devam et ve `data-i18n="anahtar"` ekle.
   Böylece çeviri katmanı çökse bile sayfa boş değil, Türkçe kalır — ve
   Türkçe okuyucu hiçbir zaman "önce İngilizce, sonra Türkçe" titremesi
   görmez, çünkü tr seçildiğinde bu dosya DOM'a hiç dokunmaz.
   ========================================================================= */
var I18N = (function () {
  "use strict";

  var LANGS = ["tr", "en"];
  var SOURCE = "tr";
  var STORE_KEY = "cq_lang";

  function storage(op, value) {
    try {
      if (op === "get") return localStorage.getItem(STORE_KEY);
      localStorage.setItem(STORE_KEY, value);
    } catch (e) {
      /* gizli sekme / kapalı depolama: dil seçimi o oturumluk kalır */
    }
    return null;
  }

  function known(l) { return LANGS.indexOf(l) >= 0 ? l : null; }

  function detect() {
    var q = null;
    try { q = known(new URLSearchParams(location.search).get("lang")); } catch (e) {}
    if (q) { storage("set", q); return q; }

    var saved = known(storage("get"));
    if (saved) return saved;

    var docLang = known((document.documentElement.getAttribute("lang") || "").slice(0, 2));
    if (docLang) return docLang;

    var nav = (navigator.language || navigator.userLanguage || SOURCE).slice(0, 2).toLowerCase();
    return nav === "tr" ? "tr" : "en";
  }

  var lang = detect();

  /* ------------------------------------------------------------- sözlük */
  function dict() {
    var all = (typeof CQ_STRINGS !== "undefined") ? CQ_STRINGS : {};
    return { active: all[lang] || {}, source: all[SOURCE] || {} };
  }

  /**
   * Çeviri. Eksik anahtarda kaynak dile, o da yoksa anahtarın kendisine
   * düşer — ekranda boşluk yerine hiç değilse bir ipucu kalsın.
   * vars: { ad: "değer" } -> metindeki {ad} yerine geçer.
   */
  function t(key, vars) {
    var d = dict();
    var s = d.active[key];
    if (s == null) s = d.source[key];
    if (s == null) return key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m;
    });
  }

  /**
   * Kaynak metnin KENDİSİ anahtardır.
   *
   * Sahne panelinde yüzlerce kısa etiket var ("yok", "kapalı", "çalışıyor").
   * Her birine `scene.node.status.none` gibi bir anahtar uydurmak, sözlüğü
   * kodu okunmaz hâle getirecek kadar şişirirdi. Bu yüzden orada Türkçe
   * metnin kendisi anahtar: karşılığı varsa çevrilir, yoksa OLDUĞU GİBİ
   * geçer. Dinamik değerler (dosya adı, IP, quest başlığı) da bu yüzden
   * zararsızca bu fonksiyondan geçebilir.
   *
   * Sabit metinli, az sayıda yer için t() daha iyidir: orada anahtar
   * Türkçe metin değişince bozulmaz.
   */
  function phrase(text) {
    if (lang === SOURCE || text == null || text === "") return text;
    var all = (typeof CQ_PHRASES !== "undefined") ? (CQ_PHRASES[lang] || {}) : {};
    return Object.prototype.hasOwnProperty.call(all, text) ? all[text] : text;
  }

  /* --------------------------------------------------------------- DOM */
  /**
   * data-i18n         -> textContent
   * data-i18n-html    -> innerHTML (içinde <b>, <em> olan bloklar için)
   * data-i18n-attr    -> "placeholder:anahtar; title:baska.anahtar"
   *
   * Kaynak dilde hiç çalışmaz: HTML zaten Türkçe yazılı.
   */
  function apply(root) {
    if (lang === SOURCE) return;
    var scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    scope.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length !== 2) return;
        el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });

    document.documentElement.setAttribute("lang", lang);
  }

  /** Dili değiştir ve sayfayı o dilde yeniden aç. */
  function setLang(next) {
    if (!known(next) || next === lang) return;
    storage("set", next);
    var url = new URL(location.href);
    url.searchParams.set("lang", next);
    location.href = url.toString();
  }

  /**
   * TR|EN anahtarı. `[data-lang-switch]` taşıyan her kaba basılır, böylece
   * her sayfa düğmeyi kendi tasarımına uygun yere koyabilir.
   */
  function mountSwitch(root) {
    (root || document).querySelectorAll("[data-lang-switch]").forEach(function (host) {
      host.innerHTML = "";
      host.classList.add("lang-switch");
      LANGS.forEach(function (l) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "lang-opt" + (l === lang ? " active" : "");
        b.textContent = l.toUpperCase();
        b.setAttribute("aria-pressed", String(l === lang));
        b.setAttribute("aria-label", l === "tr" ? "Türkçe" : "English");
        b.addEventListener("click", function () { setLang(l); });
        host.appendChild(b);
      });
    });
  }

  function boot() { apply(document); mountSwitch(document); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  return {
    lang: lang,
    source: SOURCE,
    langs: LANGS.slice(),
    isSource: lang === SOURCE,
    t: t,
    phrase: phrase,
    apply: apply,
    setLang: setLang,
    mountSwitch: mountSwitch,
  };
})();
