/* =========================================================================
   CloudQuest — Sunucu API'si (Katman 1)
   -------------------------------------------------------------------------
   Oyunun hakemiyle konuşan TEK kapı. Doğru cevap, ödül hesabı ve ipucu
   bedeli artık tarayıcıda değil; hepsi `game` Edge Function'ında.

   Buradaki hiçbir fonksiyon sonucu "uydurmaz": ne dönerse HUD onu gösterir.
   Ağ koparsa hata fırlatır — sessizce yerel ilerleme YAZILMAZ, çünkü yerel
   ilerlemeye güvenilmiyor olması Katman 1'in bütün amacı.
   ========================================================================= */
var CQApi = (function () {
  "use strict";

  var TIMEOUT_MS = 15000;

  function endpoint() {
    var cfg = window.CQ_CONFIG || {};
    if (cfg.FUNCTIONS_URL) return cfg.FUNCTIONS_URL;
    if (!cfg.SUPABASE_URL) return null;
    // https://<ref>.supabase.co -> https://<ref>.functions.supabase.co
    return cfg.SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co") + "/game";
  }

  /** Oturum token'ı: Auth katmanı tutuyor (ve gerekirse yeniliyor). */
  function accessToken() {
    if (typeof Auth === "undefined" || !Auth.accessToken) return Promise.resolve(null);
    return Promise.resolve(Auth.accessToken());
  }

  function call(action, payload) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error("Sunucu yapılandırılmamış (config.js)."));
    return accessToken().then(function (token) {
      if (!token) throw new Error("Oturum bulunamadı, tekrar giriş yap.");
      return send(url, token, action, payload);
    });
  }

  function send(url, token, action, payload) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    var body = Object.assign({ action: action }, payload || {});
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        "apikey": (window.CQ_CONFIG || {}).SUPABASE_ANON_KEY || ""
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            var err = new Error(data.error || ("Sunucu hatası (" + res.status + ")"));
            err.status = res.status;
            err.data = data;
            throw err;
          }
          return data;
        });
      })
      .catch(function (e) {
        if (e.name === "AbortError") throw new Error("Sunucu yanıt vermedi (zaman aşımı).");
        throw e;
      })
      .finally(function () { clearTimeout(timer); });
  }

  return {
    /** Quest'i başlat; sunucunun bildiği adımı döndürür (yarım kaldıysa oradan). */
    start: function (questId) { return call("start", { questId: questId }); },

    /** Komutu doğrula. Dönen: {ok, success?, objIndex?, questComplete?, award?, progress?, hint?} */
    verify: function (questId, command) { return call("verify", { questId: questId, command: command }); },

    /** İpucunu satın al (ücretsiz hak varsa ondan düşer). */
    hint: function (questId) { return call("hint", { questId: questId }); },

    /** Shop'tan satın al. */
    purchase: function (itemId) { return call("purchase", { itemId: itemId }); },

    /** Quest dışı rozet: key "guide" | "quiz". Rozet adını sunucu bilir. */
    milestone: function (key) { return call("milestone", { key: key }); },

    /** İlerlemeyi sıfırla. */
    reset: function () { return call("reset", {}); },

    isConfigured: function () { return !!endpoint(); }
  };
})();
