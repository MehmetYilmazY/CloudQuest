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
      credits: typeof r.credits === "number" ? r.credits : 100,
      rank: r.rank || "Intern ☁️",
      completed: Array.isArray(r.completed) ? r.completed : [],
      badges: Array.isArray(r.badges) ? r.badges : [],
      story: Array.isArray(r.story) ? r.story : [],
      freeHints: r.free_hints || 0
    };
  }
  function profileToRow(p) {
    return {
      name: String(p.name || "engineer").slice(0, 24),
      avatar: Number(p.avatar) || 0,
      level: Number(p.level) || 1,
      xp: Number(p.xp) || 0,
      credits: Number(p.credits) || 0,
      rank: String(p.rank || ""),
      completed: p.completed || [],
      badges: p.badges || [],
      story: p.story || [],
      free_hints: Number(p.freeHints) || 0
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

    let prof;
    if (data) {
      prof = rowToProfile(data);
    } else {
      // Trigger henüz çalışmadıysa/eksikse profili burada oluştur.
      prof = rowToProfile({ name: (_user.email || "engineer").split("@")[0] });
      await c.from("profiles").insert(Object.assign({ id: _user.id }, profileToRow(prof)));
    }

    // Çevrimdışı yedek buluttan ileriyse (son senkron başarısız olmuş), onu kullan ve yukarı it.
    const backup = readLocalBackup();
    if (backup && Array.isArray(backup.completed) &&
        backup.completed.length > prof.completed.length) {
      prof = backup;
      _cache = prof;
      await pushNow();
    }
    _cache = prof;
    writeLocalBackup();
    return prof;
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
    if (!isConfigured()) return { ok: false, error: "Sunucu yapılandırılmamış (js/config.js)." };
    const email = String(opts.email || "").trim().toLowerCase();
    const password = String(opts.password || "");
    const name = String((opts.profile && opts.profile.name) || "engineer").slice(0, 24);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Geçerli bir e-posta gir." };
    if (password.length < 6) return { ok: false, error: "Şifre en az 6 karakter olmalı." };

    const c = client();
    try {
      const { data, error } = await c.auth.signUp({
        email: email, password: password,
        options: { data: { name: name } }
      });
      if (error) return { ok: false, error: trError(error.message) };

      // E-posta doğrulaması açıksa oturum gelmez.
      if (!data.session) {
        return { ok: false, needsConfirmation: true,
                 error: "Hesabın oluşturuldu! " + email + " adresine doğrulama linki gönderdik — onayladıktan sonra giriş yap." };
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
      return { ok: false, error: trError(e.message) };
    }
  }

  async function login(emailRaw, password) {
    if (!isConfigured()) return { ok: false, error: "Sunucu yapılandırılmamış (js/config.js)." };
    const email = String(emailRaw || "").trim().toLowerCase();
    const c = client();
    try {
      const { data, error } = await c.auth.signInWithPassword({ email: email, password: String(password || "") });
      if (error) return { ok: false, error: trError(error.message) };
      _user = { id: data.user.id, email: data.user.email };
      await loadProfile();
      return { ok: true, email: email };
    } catch (e) {
      return { ok: false, error: trError(e.message) };
    }
  }

  async function logout() {
    if (_dirty) { await pushNow(); }
    const c = client();
    if (c) { try { await c.auth.signOut(); } catch (e) {} }
    _user = null; _cache = null;
  }

  async function resetPassword(emailRaw) {
    if (!isConfigured()) return { ok: false, error: "Sunucu yapılandırılmamış." };
    const email = String(emailRaw || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Önce geçerli bir e-posta gir." };
    try {
      const { error } = await client().auth.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0] });
      if (error) return { ok: false, error: trError(error.message) };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: trError(e.message) };
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
  function hasPendingWrites() { return _dirty || _saving; }
  async function flush() { clearTimeout(_saveTimer); if (_dirty) return pushNow(); return { ok: true }; }

  /* ---------- yardımcı ---------- */
  function trError(msg) {
    const m = String(msg || "");
    if (/Failed to fetch|NetworkError|fetch failed|ERR_NAME|ENOTFOUND/i.test(m))
      return "Sunucuya ulaşılamadı. İnternet bağlantını (veya Supabase ayarlarını) kontrol et.";
    if (/Invalid login credentials/i.test(m)) return "E-posta ya da şifre hatalı.";
    if (/Email not confirmed/i.test(m))       return "E-postanı henüz doğrulamadın. Gelen kutunu kontrol et.";
    if (/User already registered/i.test(m))   return "Bu e-posta zaten kayıtlı. Giriş yap.";
    if (/rate limit|too many/i.test(m))       return "Çok fazla deneme. Biraz bekleyip tekrar dene.";
    if (/Password should be/i.test(m))        return "Şifre en az 6 karakter olmalı.";
    return m;
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
    accountInfo: accountInfo,
    hasPendingWrites: hasPendingWrites,
    flush: flush
  };
})();
