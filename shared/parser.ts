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

export type LeafExpect = { cmd?: string[]; need?: string[] };
export type Expect = LeafExpect | { anyOf: LeafExpect[] };

/** Kötü niyetli girdiye karşı üst sınırlar (ReDoS / bellek koruması). */
const MAX_INPUT = 2000;
const MAX_SEGMENTS = 24;
const MAX_TOKENS = 200;

export function tokenize(segment: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let quote: string | null = null;
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

export function segments(raw: string): string[] {
  return String(raw)
    .slice(0, MAX_INPUT)
    .replace(/&&|;/g, "|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_SEGMENTS);
}

function tokenMatches(token: string, matcher: string): boolean {
  if (matcher.startsWith("re:")) {
    try { return new RegExp(matcher.slice(3)).test(token); } catch { return false; }
  }
  return matcher.split("|").includes(token);
}

function matchSpec(tokens: string[], spec: LeafExpect): boolean {
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

export function match(raw: string, expect: Expect | null | undefined): boolean {
  if (!expect) return false;
  if ("anyOf" in expect && Array.isArray(expect.anyOf)) {
    return expect.anyOf.some((sub) => match(raw, sub));
  }
  for (const seg of segments(raw)) {
    if (matchSpec(tokenize(seg), expect as LeafExpect)) return true;
  }
  return false;
}
