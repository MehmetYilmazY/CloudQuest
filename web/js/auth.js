/* =========================================================================
   CloudQuest — Auth SİMÜLASYONU (client-side, localStorage)
   ⚠ DİKKAT: Bu GERÇEK GÜVENLİK DEĞİLDİR. Tüm kod tarayıcıda açıkta çalışır;
   burada "kimlik doğrulama" yalnızca çok-profilli bir UX simülasyonudur.
   SHA-256 + salt yalnızca düz-metin şifreyi localStorage'da tutmamak içindir
   (hijyen); saldırıya karşı koruma sağlamaz. Gerçek güvenlik = sunucu + DB +
   sunucu tarafı auth. API yüzeyi, ileride bir REST backend'e (fetch) taşınacak
   şekilde bilinçli olarak soyut tutuldu.
   ========================================================================= */

const Auth = (function () {
  "use strict";

  const STORE_KEY   = "cloudquest.accounts.v1";
  const SESSION_KEY = "cloudquest.session.v1";

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { users: {} }; }
    catch (e) { return { users: {} }; }
  }
  function writeStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function normEmail(e) { return String(e || "").trim().toLowerCase(); }

  /* ---- şifre hash (SubtleCrypto varsa kripto, yoksa fallback) ---- */
  function randSalt() {
    const b = new Uint8Array(16);
    (self.crypto || window.crypto).getRandomValues(b);
    return Array.from(b).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }
  async function hashPw(password, salt) {
    const data = salt + "::" + password;
    const subtle = (self.crypto && self.crypto.subtle) || (window.crypto && window.crypto.subtle);
    if (subtle) {
      const buf = await subtle.digest("SHA-256", new TextEncoder().encode(data));
      return Array.from(new Uint8Array(buf)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    }
    // fallback (kriptografik değil; sadece subtle yoksa): FNV-1a
    let h = 0x811c9dc5;
    for (let i = 0; i < data.length; i++) { h ^= data.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    return "fnv" + h.toString(16);
  }

  /* ---- API ---- */
  function hasUsers() { return Object.keys(readStore().users).length > 0; }

  function currentEmail() {
    try {
      const e = localStorage.getItem(SESSION_KEY);
      const s = readStore();
      return (e && s.users[e]) ? e : null;
    } catch (x) { return null; }
  }

  async function register(opts) {
    const email = normEmail(opts.email);
    const password = String(opts.password || "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Geçerli bir e-posta gir." };
    if (password.length < 6) return { ok: false, error: "Şifre en az 6 karakter olmalı." };
    const s = readStore();
    if (s.users[email]) return { ok: false, error: "Bu e-posta zaten kayıtlı. Giriş yap." };

    const salt = randSalt();
    const hash = await hashPw(password, salt);
    s.users[email] = {
      email: email,
      salt: salt,
      hash: hash,
      createdAt: Date.now(),
      profile: opts.profile || null   // oyun profili (game.js doldurur)
    };
    writeStore(s);
    localStorage.setItem(SESSION_KEY, email);
    return { ok: true, email: email };
  }

  async function login(emailRaw, password) {
    const email = normEmail(emailRaw);
    const s = readStore();
    const u = s.users[email];
    if (!u) return { ok: false, error: "Böyle bir hesap yok. Kayıt ol." };
    const hash = await hashPw(String(password || ""), u.salt);
    if (hash !== u.hash) return { ok: false, error: "Şifre yanlış." };
    localStorage.setItem(SESSION_KEY, email);
    return { ok: true, email: email };
  }

  function logout() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

  function getProfile() {
    const email = currentEmail();
    if (!email) return null;
    return readStore().users[email].profile;
  }
  function saveProfile(profile) {
    const email = currentEmail();
    if (!email) return;
    const s = readStore();
    s.users[email].profile = profile;
    writeStore(s);
  }
  function accountInfo() {
    const email = currentEmail();
    if (!email) return null;
    const u = readStore().users[email];
    return { email: u.email, createdAt: u.createdAt };
  }

  return {
    hasUsers: hasUsers,
    currentEmail: currentEmail,
    register: register,
    login: login,
    logout: logout,
    getProfile: getProfile,
    saveProfile: saveProfile,
    accountInfo: accountInfo
  };
})();
