/* =========================================================================
   CloudQuest — tarayıcı tarafı tokenizer  (SADECE GÖRSEL)
   -------------------------------------------------------------------------
   ⚠ KATMAN 1 DEĞİŞİKLİĞİ: doğrulama artık BURADA YAPILMIYOR.

   Eskiden bu dosya `expect` spec'ine göre "doğru mu?" kararını veriyordu.
   Bu, doğru cevabın tarayıcıya gönderilmesi anlamına geliyordu — yani
   herkes DevTools'tan cevap anahtarını okuyabiliyordu. Artık karar
   sunucunun: supabase/functions/game (`verify` action), paylaşılan çekirdek
   shared/parser.ts.

   Geriye kalan tek iş: sağdaki sahne panelinin (scene.js) yazılan komutu
   kelimelerine ayırıp "ne yaptığını" görselleştirmesi. Buradan çıkan hiçbir
   sonuç ilerlemeyi etkilemez.
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

  return { tokenize: tokenize };
})();
