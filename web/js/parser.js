/* =========================================================================
   CloudQuest — Komut parser & doğrulayıcı  (regex yerine yapısal eşleştirme)
   Girdiyi pipe/&&/; ile segmentlere böler, her segmenti quote-farkında
   tokenize eder, baştaki 'sudo'yu atar; sonra bildirimsel 'expect' spec'e
   göre eşleştirir. Böylece flag sırası, fazladan flag, pipe ve tırnak
   kullanıcıyı "yanlış" cevaba düşürmez.

   expect biçimi:
     { cmd: ["git","checkout|switch"], need: ["-b|-c","re:.+"] }
     veya  { anyOf: [ {cmd:...}, {cmd:...} ] }
   Eşleyici (need & cmd token):
     "a|b|c"   -> token bunlardan birine EŞİT
     "re:PAT"  -> token PAT regex'ine uyar
   need: her eşleyici, kalan token'lardan FARKLI birini tüketir (sırasız).

   NOT: Aynı mantık cloudquest.ps1 içinde PowerShell olarak da var (SSOT: spec
   data/curriculum.json'da; parser her runtime'da küçük ve sabit).
   ========================================================================= */
var CQParser = (function () {
  "use strict";

  function tokenize(segment) {
    var tokens = [], cur = "", quote = null, i, ch;
    for (i = 0; i < segment.length; i++) {
      ch = segment[i];
      if (quote) {
        if (ch === quote) quote = null; else cur += ch;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === " " || ch === "\t") {
        if (cur !== "") { tokens.push(cur); cur = ""; }
      } else {
        cur += ch;
      }
    }
    if (cur !== "") tokens.push(cur);
    if (tokens.length && tokens[0].toLowerCase() === "sudo") tokens.shift();
    return tokens;
  }

  function segments(raw) {
    // pipe / && / ; ayraçlarını normalize edip böl
    return String(raw).replace(/&&|;/g, "|").split("|")
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  function tokenMatches(token, matcher) {
    if (matcher.indexOf("re:") === 0) {
      try { return new RegExp(matcher.slice(3)).test(token); } catch (e) { return false; }
    }
    return matcher.split("|").indexOf(token) !== -1;
  }

  function matchSpec(tokens, spec) {
    var cmd = spec.cmd || [], i;
    if (tokens.length < cmd.length) return false;
    for (i = 0; i < cmd.length; i++) {
      if (!tokenMatches(tokens[i], cmd[i])) return false;
    }
    var remaining = tokens.slice(cmd.length);
    var used = remaining.map(function () { return false; });
    var need = spec.need || [];
    for (i = 0; i < need.length; i++) {
      var found = false;
      for (var j = 0; j < remaining.length; j++) {
        if (!used[j] && tokenMatches(remaining[j], need[i])) { used[j] = true; found = true; break; }
      }
      if (!found) return false;
    }
    return true;
  }

  function match(raw, expect) {
    if (!expect) return false;
    if (expect.anyOf) {
      return expect.anyOf.some(function (sub) { return match(raw, sub); });
    }
    var segs = segments(raw);
    for (var s = 0; s < segs.length; s++) {
      if (matchSpec(tokenize(segs[s]), expect)) return true;
    }
    return false;
  }

  return { match: match, tokenize: tokenize };
})();
