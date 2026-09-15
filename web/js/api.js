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
    // Supabase'in kanonik biçimi: <proje-url>/functions/v1/<fonksiyon-adi>
    // (supabase-js'in functions.invoke() çağrısı da bunu kullanır.)
    return cfg.SUPABASE_URL.replace(/\/+$/, "") + "/functions/v1/game";
  }

  /** Oturum token'ı: Auth katmanı tutuyor (ve gerekirse yeniliyor). */
  function accessToken() {
    if (typeof Auth === "undefined" || !Auth.accessToken) return Promise.resolve(null);
    return Promise.resolve(Auth.accessToken());
  }

  function call(action, payload) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error(I18N.t("api.notConfigured")));
    return accessToken().then(function (token) {
      if (!token) throw new Error(I18N.t("api.noSession"));
      return send(url, token, action, payload);
    });
  }

  function send(url, token, action, payload) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

    /* Dil sunucuya da gider: hata mesajlarını ve ileride ipucu metnini
       oyuncunun okuduğu dilde döndürebilsin. */
    var body = Object.assign({ action: action, lang: I18N.lang }, payload || {});
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
            // 404 = fonksiyon o isimle yayında değil. En sık yapılan hata bu
            // olduğu için mesajı tahmine bırakmıyoruz.
            var msg = res.status === 404
              ? I18N.t("api.notDeployed")
              : (data.error || I18N.t("api.serverError", { status: res.status }));
            var err = new Error(msg);
            err.status = res.status;
            err.data = data;
            throw err;
          }
          return data;
        });
      })
      .catch(function (e) {
        if (e.name === "AbortError") throw new Error(I18N.t("api.timeout"));
        throw e;
      })
      .finally(function () { clearTimeout(timer); });
  }

  return {
    /**
     * Quest'i tamamla ve ödülü al. Quest başına TEK istek.
     * Komut kontrolü tarayıcıda yapıldığı için sunucuya sadece bu geliyor.
     */
    complete: function (questId, attempts) {
      return call("complete", { questId: questId, attempts: attempts || [] });
    },

    /**
     * İpucu metnini getir. `free` true ise 3 yanlış sonrası güvenlik ağıdır
     * (bedelsiz); false ise sunucu krediden ya da ücretsiz haktan düşer.
     */
    hint: function (questId, objIndex, free) {
      return call("hint", { questId: questId, objIndex: objIndex, free: !!free });
    },

    /** Shop'tan satın al. */
    purchase: function (itemId) { return call("purchase", { itemId: itemId }); },

    /** Quest dışı rozet: key "guide" | "quiz". Rozet adını sunucu bilir. */
    milestone: function (key) { return call("milestone", { key: key }); },

    /** İlerlemeyi sıfırla. */
    reset: function () { return call("reset", {}); },

    isConfigured: function () { return !!endpoint(); }
  };
})();
