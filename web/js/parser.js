/* ======================================================================
   AUTO-GENERATED from shared/parser.ts — DO NOT EDIT.
   Uret: npm run build

   Ayni parser sunucuda da calisiyor (supabase/functions/_shared/parser.ts).
   Kaynagi tek: shared/parser.ts. Buradaki bir degisiklik bir sonraki
   build'de silinir; kurali degistirmek istiyorsan kaynagi duzenle.
   ====================================================================== */
var CQParser = (function () {
  "use strict";
  /* =========================================================================
     CloudQuest — Komut parser & doğrulayıcı  (regex yerine yapısal eşleştirme)
     -------------------------------------------------------------------------
     TEK KAYNAK. Bu dosya artık SUNUCUDA çalışır (supabase/functions/verify).
     Tarayıcıya gönderilmez; çünkü doğru cevabı bilen taraf burasıdır.

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
     ========================================================================= */

                                                             
                                                          

  /** Kötü niyetli girdiye karşı üst sınırlar (ReDoS / bellek koruması). */
  const MAX_INPUT = 2000;
  const MAX_SEGMENTS = 24;
  const MAX_TOKENS = 200;

  function tokenize(segment        )           {
    const tokens           = [];
    let cur = "";
    let quote                = null;
    for (let i = 0; i < segment.length && tokens.length <= MAX_TOKENS; i++) {
      const ch = segment[i];
      if (quote) {
        if (ch === quote) quote = null;
        else cur += ch;
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

  function segments(raw        )           {
    return String(raw)
      .slice(0, MAX_INPUT)
      .replace(/&&|;/g, "|")
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, MAX_SEGMENTS);
  }

  function tokenMatches(token        , matcher        )          {
    if (matcher.startsWith("re:")) {
      try { return new RegExp(matcher.slice(3)).test(token); } catch { return false; }
    }
    return matcher.split("|").includes(token);
  }

  function matchSpec(tokens          , spec            )          {
    const cmd = spec.cmd ?? [];
    if (tokens.length < cmd.length) return false;
    for (let i = 0; i < cmd.length; i++) {
      if (!tokenMatches(tokens[i], cmd[i])) return false;
    }
    const remaining = tokens.slice(cmd.length);
    const used = remaining.map(() => false);
    for (const matcher of spec.need ?? []) {
      let found = false;
      for (let j = 0; j < remaining.length; j++) {
        if (!used[j] && tokenMatches(remaining[j], matcher)) { used[j] = true; found = true; break; }
      }
      if (!found) return false;
    }
    return true;
  }

  function match(raw        , expect                           )          {
    if (!expect) return false;
    if ("anyOf" in expect && Array.isArray(expect.anyOf)) {
      return expect.anyOf.some((sub) => match(raw, sub));
    }
    for (const seg of segments(raw)) {
      if (matchSpec(tokenize(seg), expect              )) return true;
    }
    return false;
  }

  return { match: match, tokenize: tokenize, segments: segments };
})();
