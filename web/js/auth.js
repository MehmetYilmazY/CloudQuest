/* =========================================================================
   CloudQuest — GERÇEK hesap katmanı (Supabase Auth + Postgres)
   -------------------------------------------------------------------------
   • Kimlik doğrulama sunucuda yapılır (Supabase Auth). Şifreler asla
     tarayıcıda tutulmaz/hash'lenmez; sunucuda bcrypt ile saklanır.
   • İlerleme public.profiles tablosunda; Row Level Security sayesinde her
     kullanıcı yalnızca KENDİ satırına erişir (bkz. supabase/schema.sql).
   • Oturum (JWT) Supabase SDK tarafından yönetilir, otomatik yenilenir.

   TASARIM: game.js'teki çağrılar senkron olduğu için profil, oturum
   açılışında bir kez belleğe alınır (_cache). Okumalar senkron; yazmalar
   önce belleğe, sonra debounce'lu şekilde buluta gider. Ağ koparsa yerel
   yedek (localStorage) tutulur ve bir sonraki açılışta buluta itilir.
   ========================================================================= */

const Auth = (function () {
  "use strict";

  const SAVE_DEBOUNCE_MS = 800;
  const CACHE_PREFIX = "cloudquest.cache.";   // sadece çevrimdışı güvenlik yedeği

  let _client = null;
  let _user = null;         // { id, email }
  let _cache = null;        // oyun profili (camelCase)
  let _saveTimer = null;
  let _saving = false;
  let _dirty = false;

  /* ---------- yapılandırma ---------- */
  function cfg() { return (window.CQ_CONFIG || {}); }
  function isConfigured() {
    const c = cfg();
    return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY);
  }
  function client() {
    if (_client) return _client;
    if (!isConfigured() || typeof supabase === "undefined") return null;
    _client = supabase.createClient(cfg().SUPABASE_URL, cfg().SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return _client;
  }

  /* ---------- satır <-> profil dönüşümü ---------- */
  function rowToProfile(r) {
    return {
      name: r.name || "engineer",
      avatar: typeof r.avatar === "number" ? r.avatar : 0,
      level: r.level || 1,
      xp: r.xp || 0,
      credits: typeof r.credits === "number" ? r.credits : 60,
      rank: r.rank || "Intern ☁️",
      completed: Array.isArray(r.completed) ? r.completed : [],
      badges: Array.isArray(r.badges) ? r.badges : [],
      story: Array.isArray(r.story) ? r.story : [],
      freeHints: r.free_hints || 0
    };
  }
  /* KATMAN 1: istemci artık ilerleme YAZMAZ.
     Veritabanında `profiles` üzerinde kolon bazlı GRANT var — bu üç alan
     dışında bir şey göndermek Postgres tarafından reddedilir. Level, XP,
     credits, rozet ve tamamlanan questleri yalnızca `game` Edge Function
     yazabilir (bkz. supabase/schema.sql §5). */
  function profileToRow(p) {
    return {
      name: String(p.name || "engineer").slice(0, 24),
      avatar: Number(p.avatar) || 0,
      story: p.story || []          // hangi sinematik gösterildi (kozmetik)
    };
  }

  /* ---------- çevrimdışı güvenlik yedeği ---------- */
  function localBackupKey() { return _user ? CACHE_PREFIX + _user.id : null; }
  function writeLocalBackup() {
    const k = localBackupKey(); if (!k || !_cache) return;
    try { localStorage.setItem(k, JSON.stringify(_cache)); } catch (e) {}
  }
  function readLocalBackup() {
    const k = localBackupKey(); if (!k) return null;
    try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; }
  }
  function clearLocalBackup() {
    const k = localBackupKey(); if (!k) return;
    try { localStorage.removeItem(k); } catch (e) {}
  }

  /* ---------- profil yükleme / yazma ---------- */
  async function loadProfile() {
    const c = client(); if (!c || !_user) return null;
    const { data, error } = await c.from("profiles").select("*").eq("id", _user.id).maybeSingle();
    if (error) throw error;

    if (!data) {
      // Satırı handle_new_user() trigger'ı oluşturur; istemcinin INSERT
      // yetkisi yok (kendi başlangıç değerlerini seçemesin diye).
      // Trigger'ın yetişmediği nadir durumda kısa bir kez daha bakarız.
      await new Promise(function (r) { setTimeout(r, 400); });
      const retry = await c.from("profiles").select("*").eq("id", _user.id).maybeSingle();
      if (retry.error || !retry.data) throw new Error(I18N.t("auth.noProfile"));
      _cache = rowToProfile(retry.data);
      return _cache;
    }

    /* NOT (Katman 1): eskiden burada "çevrimdışı yedek buluttan ileriyse onu
       kullan" mantığı vardı. Kaldırıldı — localStorage'ı elle düzenleyip
       daha "ileri" bir ilerleme uydurmak hesabı yükseltiyordu. Artık tek
       otorite sunucu; çevrimdışı ilerleme diye bir şey yok. */
    _cache = rowToProfile(data);
    writeLocalBackup();
    return _cache;
  }

  /** Sunucudan gelen ilerlemeyi belleğe uygula (Edge Function yanıtları). */
  function applyServerProgress(progress) {
    if (!_cache || !progress) return _cache;
    if (typeof progress.level === "number")   _cache.level = progress.level;
    if (typeof progress.xp === "number")      _cache.xp = progress.xp;
    if (typeof progress.credits === "number") _cache.credits = progress.credits;
    if (typeof progress.rank === "string")    _cache.rank = progress.rank;
    if (Array.isArray(progress.badges))       _cache.badges = progress.badges;
    if (Array.isArray(progress.completed))    _cache.completed = progress.completed;
    if (typeof progress.freeHints === "number") _cache.freeHints = progress.freeHints;
    writeLocalBackup();
    return _cache;
  }

  /** Profili sunucudan tazele (ödül sonrası kesin doğruluk için). */
  async function refreshProfile() {
    if (!_user) return null;
    return loadProfile();
  }

  async function pushNow() {
    const c = client();
    if (!c || !_user || !_cache) return { ok: false };
    _saving = true;
    try {
      const { error } = await c.from("profiles")
        .update(profileToRow(_cache))
        .eq("id", _user.id);
      if (error) throw error;
      _dirty = false;
      clearLocalBackup();          // bulut güncel; yedeğe gerek yok
      return { ok: true };
    } catch (e) {
      _dirty = true;
      writeLocalBackup();          // ağ hatası: yerelde sakla, sonra dene
      return { ok: false, error: e.message };
    } finally {
      _saving = false;
    }
  }

  function scheduleSave() {
    _dirty = true;
    writeLocalBackup();
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(function () { pushNow(); }, SAVE_DEBOUNCE_MS);
  }

  /* ---------- açılış ---------- */
  async function init() {
    if (!isConfigured()) return { ok: false, reason: "not-configured" };
    const c = client();
    if (!c) return { ok: false, reason: "sdk-missing" };
    try {
      const { data } = await c.auth.getSession();
      if (data && data.session && data.session.user) {
        _user = { id: data.session.user.id, email: data.session.user.email };
        await loadProfile();
      }
      // Sekme/oturum değişimlerini izle (ör. başka sekmede çıkış).
      c.auth.onAuthStateChange(function (event) {
        if (event === "SIGNED_OUT") { _user = null; _cache = null; }
      });
      return { ok: true, signedIn: !!_user };
    } catch (e) {
      return { ok: false, reason: "network", error: e.message };
    }
  }

  /* ---------- kayıt / giriş / çıkış ---------- */
  async function register(opts) {
    if (!isConfigured()) return { ok: false, error: I18N.t("auth.notConfigured"), code: "config" };
    const email = String(opts.email || "").trim().toLowerCase();
    const password = String(opts.password || "");
    const name = String((opts.profile && opts.profile.name) || "engineer").slice(0, 24);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: I18N.t("auth.badEmail"), code: "bad-email" };
    if (password.length < 6) return { ok: false, error: I18N.t("auth.weakPassword"), code: "weak-password" };

    const c = client();
    try {
      const { data, error } = await c.auth.signUp({
        email: email, password: password,
        options: { data: { name: name } }
      });
      if (error) return { ok: false, error: trError(error.message), code: errCode(error.message) };

      // E-posta doğrulaması açıksa oturum gelmez.
      if (!data.session) {
        return { ok: false, needsConfirmation: true, code: "unconfirmed",
                 error: I18N.t("auth.confirmSent", { email: email }) };
      }
      _user = { id: data.user.id, email: data.user.email };
      await loadProfile();
      // Kayıt formundaki ad + avatar seçimini uygula.
      if (_cache) {
        _cache.name = name;
        if (opts.profile && typeof opts.profile.avatar === "number") _cache.avatar = opts.profile.avatar;
        await pushNow();
      }
      return { ok: true, email: email };
    } catch (e) {
      return { ok: false, error: trError(e.message), code: errCode(e.message) };
    }
  }

  async function login(emailRaw, password) {
    if (!isConfigured()) return { ok: false, error: "Sunucu yapılandırılmamış (js/config.js).", code: "config" };
    const email = String(emailRaw || "").trim().toLowerCase();
    const c = client();
    try {
      const { data, error } = await c.auth.signInWithPassword({ email: email, password: String(password || "") });
      if (error) return { ok: false, error: trError(error.message), code: errCode(error.message) };
      _user = { id: data.user.id, email: data.user.email };
      await loadProfile();
      return { ok: true, email: email };
    } catch (e) {
      return { ok: false, error: trError(e.message), code: errCode(e.message) };
    }
  }

  async function logout() {
    if (_dirty) { await pushNow(); }
    const c = client();
    if (c) { try { await c.auth.signOut(); } catch (e) {} }
    _user = null; _cache = null;
  }

  async function resetPassword(emailRaw) {
    if (!isConfigured()) return { ok: false, error: I18N.t("auth.notConfiguredShort"), code: "config" };
    const email = String(emailRaw || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: I18N.t("auth.emailFirst"), code: "bad-email" };
    try {
      const { error } = await client().auth.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0] });
      if (error) return { ok: false, error: trError(error.message), code: errCode(error.message) };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: trError(e.message), code: errCode(e.message) };
    }
  }

  /* ---------- oyun tarafı (senkron) ---------- */
  function currentEmail() { return _user ? _user.email : null; }
  function getProfile() { return _cache; }
  function saveProfile(profile) {
    if (!_user) return;
    _cache = profile;
    scheduleSave();
  }
  function accountInfo() { return _user ? { email: _user.email, id: _user.id } : null; }

  /** Edge Function çağrıları için taze access token (CQApi ödünç alır).
      getSession() süresi dolmuşsa token'ı kendisi yeniler; bu yüzden
      token'ı elde saklamıyoruz — her çağrıda buradan isteniyor. */
  async function accessToken() {
    const c = client();
    if (!c) return null;
    try {
      const { data } = await c.auth.getSession();
      return (data && data.session && data.session.access_token) || null;
    } catch (e) {
      return null;
    }
  }
  function hasPendingWrites() { return _dirty || _saving; }
  async function flush() { clearTimeout(_saveTimer); if (_dirty) return pushNow(); return { ok: true }; }

  /* ---------- yardımcı ---------- */
  /* Hatanın TÜRÜ. Arayüz bunu damga metnine çevirir (ACCESS DENIED,
     CONNECTION FAILED, …) — kullanıcıya sadece "bir şeyler ters gitti"
     demek yerine neyin ters gittiğini söyleyebilmek için. */
  function errCode(msg) {
    const m = String(msg || "");
    if (/Failed to fetch|NetworkError|fetch failed|ERR_NAME|ENOTFOUND/i.test(m)) return "network";
    if (/Invalid login credentials/i.test(m)) return "credentials";
    if (/Email not confirmed/i.test(m))       return "unconfirmed";
    if (/User already registered/i.test(m))   return "duplicate";
    if (/rate limit|too many/i.test(m))       return "ratelimit";
    if (/Password should be/i.test(m))        return "weak-password";
    return "unknown";
  }

  /* Hata kodunu kullanıcının dilinde bir cümleye çevirir. Bilinmeyen kod
     ham mesajla döner: gizlemek yerine göstermek, hata ayıklamayı kolaylaştırır. */
  function trError(msg) {
    const code = errCode(msg);
    return code === "unknown" ? String(msg || "") : I18N.t("autherr." + code);
  }

  // Sekme kapanırken bekleyen yazmayı kurtar.
  window.addEventListener("pagehide", function () {
    if (_dirty) { writeLocalBackup(); pushNow(); }
  });

  return {
    init: init,
    isConfigured: isConfigured,
    register: register,
    login: login,
    logout: logout,
    resetPassword: resetPassword,
    currentEmail: currentEmail,
    getProfile: getProfile,
    saveProfile: saveProfile,
    applyServerProgress: applyServerProgress,
    refreshProfile: refreshProfile,
    accessToken: accessToken,
    accountInfo: accountInfo,
    hasPendingWrites: hasPendingWrites,
    flush: flush
  };
})();
