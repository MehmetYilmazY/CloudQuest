/* =========================================================================
   CloudQuest — "Cloud Engineering bana uygun mu?" uyum testi
   -------------------------------------------------------------------------
   İLKE: Bu test iltifat makinesi DEĞİL. Cevaplar uyumsuzluğa işaret ediyorsa
   bunu kibarca söyler ve daha iyi oturabilecek alternatif roller önerir.
   Kariyer kararını etkileyebilecek bir araçta dürüstlük, motivasyondan önce gelir.

   Ölçülen 5 boyut:
     debug  — hata karşısında inat / problem çözme
     text   — terminal ve metin tabanlı araç konforu
     auto   — tekrarı otomatikleştirme refleksi
     learn  — sürekli öğrenme iştahı (+ teknik İngilizce)
     ops    — sorumluluk, baskı ve belirsizlik toleransı
   ========================================================================= */
var Quiz = (function () {
  "use strict";

  /* Soru bankası tek dilde (Türkçe) yazılı; çevirisi ÇİZİM anında
     uygulanıyor (bkz. i18n.js/phrase). Böylece puanlama tablosu ile metin
     birbirinden ayrı kalıyor: yeni bir dil eklemek soruların yapısına
     dokunmuyor. */
  var P = I18N.phrase;

  const BADGE = "🧪 Kendini Tanı";

  const DIMS = {
    debug: { label: "Problem çözme inadı", icon: "🔧" },
    text:  { label: "Terminal konforu",     icon: "⌨️" },
    auto:  { label: "Otomasyon refleksi",   icon: "🔁" },
    learn: { label: "Sürekli öğrenme",      icon: "📚" },
    ops:   { label: "Sorumluluk toleransı", icon: "🌙" }
  };

  const Q = [
    { q: "Bilgisayarında bir şey bozuldu — wifi sürekli kopuyor. Ne yaparsın?",
      a: [
        { t: "Kendim kurcalarım, forumları tararım, çözene kadar uğraşırım", s: { debug: 3, learn: 2 } },
        { t: "Biraz denerim, olmazsa bilen birine sorarım",                   s: { debug: 2, learn: 1 } },
        { t: "Kapatıp açarım, olmazsa öylece yaşarım",                        s: { debug: 1 } },
        { t: "Hemen destekten/bir tanıdıktan yardım isterim",                 s: { debug: 0 } }
      ] },
    { q: "Aynı sıkıcı işi üçüncü kez elle yapıyorsun (50 dosyayı yeniden adlandırmak gibi).",
      a: [
        { t: "Bunu daha önce otomatikleştirdim / script yazdım",              s: { auto: 3, text: 2 } },
        { t: "“Bunun bir yolu olmalı” deyip araştırmaya başlarım",            s: { auto: 3, learn: 1 } },
        { t: "Sıkılırım ama yine de elle bitiririm",                          s: { auto: 1 } },
        { t: "Elle yapmak beni rahatsız etmez",                               s: { auto: 0 } }
      ] },
    { q: "Siyah ekran, beyaz yazılar, fare yok — sadece komut yazıyorsun. İlk hissin?",
      a: [
        { t: "Havalı görünüyor, denemek isterim",                             s: { text: 3 } },
        { t: "Gözümü korkutuyor ama öğrenebilirim",                           s: { text: 2, learn: 1 } },
        { t: "Karmaşık geliyor, görsel arayüz olsa daha iyi",                 s: { text: 1 } },
        { t: "Bu kesinlikle bana göre değil",                                 s: { text: 0 } }
      ] },
    { q: "İki saattir aynı hatayla boğuşuyorsun ve hâlâ çözemedin.",
      a: [
        { t: "İnatla devam ederim; çözdüğüm an müthiş hissederim",            s: { debug: 3, ops: 2 } },
        { t: "Ara veririm, kafam açılınca geri dönerim",                      s: { debug: 2, ops: 1 } },
        { t: "Bir noktadan sonra başkasına devrederim",                       s: { debug: 1 } },
        { t: "Sinirlenir, bırakırım — bu tür şeyler beni yıpratıyor",         s: { debug: 0 } }
      ] },
    { q: "Yeni öğrendiğin araç 1-2 yıl içinde eskiyor, yenisini öğrenmen gerekiyor.",
      a: [
        { t: "Sektör böyle, yeni şey öğrenmeyi severim",                      s: { learn: 3 } },
        { t: "Zahmetli ama gerekiyorsa yaparım",                              s: { learn: 2 } },
        { t: "Yorucu — bir şeyi öğrenip uzun süre kullanmayı tercih ederim",  s: { learn: 0 } }
      ] },
    { q: "Gece 03:00, sistem çöktü ve o hafta nöbetçi sensin.",
      a: [
        { t: "Adrenalin basar, çözmek isterim",                               s: { ops: 3, debug: 1 } },
        { t: "Hoşuma gitmez ama işin parçası, yaparım",                       s: { ops: 2 } },
        { t: "Ara sıra olabilir ama düzenli olursa zorlanırım",               s: { ops: 1 } },
        { t: "Bu beni ciddi şekilde strese sokar",                            s: { ops: 0 } }
      ] },
    { q: "Hangisi sana daha çok heyecan veriyor?",
      a: [
        { t: "Sistemleri hızlı, güvenli ve dayanıklı hale getirmek",          s: { debug: 2, auto: 2, ops: 1 } },
        { t: "Bir şeyin kaputunun altında nasıl çalıştığını çözmek",          s: { debug: 3, text: 1 } },
        { t: "Veriden anlam çıkarmak, grafik ve analiz",                      s: { debug: 1 }, alt: "data" },
        { t: "Güzel görünen, kullanışlı arayüzler tasarlamak",                s: { debug: 0 }, alt: "frontend" }
      ] },
    { q: "Teknik dokümanların çoğu İngilizce. Senin durumun?",
      a: [
        { t: "Rahatça okurum",                                                s: { learn: 3 } },
        { t: "Zorlanırım ama sözlük/çeviriyle hallederim",                    s: { learn: 2 } },
        { t: "İngilizce benim için ciddi bir engel",                          s: { learn: 0 } }
      ] },
    { q: "Neden cloud engineering?",
      a: [
        { t: "Sistemler ve altyapı ilgimi çekiyor, kurcalamayı seviyorum",    s: { learn: 3, debug: 1 } },
        { t: "Teknolojiye ilgim var, bu alan mantıklı geldi",                 s: { learn: 2 } },
        { t: "Henüz emin değilim, keşfediyorum",                              s: { learn: 1 } },
        { t: "Maaşların iyi olduğunu duydum",                                 s: { learn: 0 } }
      ] },
    { q: "Yaptığın bir hata yüzünden 500 kullanıcı yarım saat sistemi kullanamadı.",
      a: [
        { t: "Sorumluluğu alırım, kök nedeni bulur, tekrarını engellerim",    s: { ops: 3, debug: 2 } },
        { t: "Çok kötü hissederim ama toparlar, düzeltirim",                  s: { ops: 2 } },
        { t: "Böyle bir sorumluluk bana ağır gelir",                          s: { ops: 0 } }
      ] }
  ];

  /* ---------- puanlama ---------- */
  function maxScores() {
    var max = { debug: 0, text: 0, auto: 0, learn: 0, ops: 0 };
    Q.forEach(function (item) {
      var best = { debug: 0, text: 0, auto: 0, learn: 0, ops: 0 };
      item.a.forEach(function (opt) {
        Object.keys(best).forEach(function (k) { best[k] = Math.max(best[k], (opt.s && opt.s[k]) || 0); });
      });
      Object.keys(max).forEach(function (k) { max[k] += best[k]; });
    });
    return max;
  }

  function verdict(pct) {
    if (pct >= 78) return {
      tier: "strong", title: "Bu iş sana çok uyuyor",
      body: "Cevapların, bu işin günlük gerçekleriyle (kurcalamak, inat etmek, öğrenmeye devam etmek) doğal olarak örtüşüyor. " +
            "Eksiğin bilgi olabilir — o öğrenilir. Asıl zor olan mizaç kısmı sende var."
    };
    if (pct >= 60) return {
      tier: "good", title: "Uygun görünüyorsun",
      body: "Temel eğilimlerin doğru yönde. Bazı alanlarda kendini zorlaman gerekecek ama bu normal — " +
            "kimse bu işe hazır doğmuyor. Aşağıdaki düşük çıkan boyutlara bilinçli çalış."
    };
    if (pct >= 42) return {
      tier: "mixed", title: "Kısmen uyumlu — ama gözünü açman gereken yerler var",
      body: "Bazı yönlerin uygun, bazıları değil. Bu “yapamazsın” demek değil; ancak zorlanacağın kısımları " +
            "<b>baştan bilerek</b> girmen gerekiyor. Aşağıdaki düşük boyutlar senin gerçek ödevin. " +
            "Küçük bir denemeyle başla: Terminal 101'i bitir, nasıl hissettiğine bak."
    };
    return {
      tier: "weak", title: "Dürüst olalım: başka bir rol sana daha iyi oturabilir",
      body: "Cevapların, bu işin en yorucu taraflarıyla (belirsizlik, sürekli öğrenme, sorumluluk baskısı, metin tabanlı araçlar) " +
            "pek uyuşmadığını gösteriyor. Bu bir yetenek yargısı değil — <b>tercih</b> meselesi. " +
            "Yine de merak ediyorsan Terminal 101'i dene; belki fikrin değişir. Ama zorlayarak sevilen bir iş olmuyor."
    };
  }

  function altRoles(counts, dims, pct) {
    var out = [];
    if (counts.frontend) out.push("<b>Frontend / UI geliştirme</b> — görsel iş, anında geri bildirim");
    if (counts.data) out.push("<b>Veri analizi / BI</b> — sistem değil, anlam çıkarma odaklı");
    if (dims.text <= 40) out.push("<b>IT destek, sistem yöneticiliği (GUI ağırlıklı)</b> — teknoloji var, terminal az");
    if (dims.ops <= 35) out.push("<b>QA / test</b> ya da <b>teknik dokümantasyon</b> — nöbet baskısı yok");
    if (dims.learn <= 35) out.push("<b>Daha yavaş değişen alanlar</b> — ağ/donanım, ERP, muhasebe yazılımları");
    if (!out.length && pct < 60) out.push("<b>DevOps yerine SRE-dışı roller</b> — proje yönetimi, ürün, satış öncesi teknik danışmanlık");
    return out;
  }

  /* ---------- durum ---------- */
  var idx = 0, answers = [], root = null, onFinish = null, finished = false;

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function renderQuestion() {
    var item = Q[idx];
    el("q-progress-fill").style.width = Math.round(idx / Q.length * 100) + "%";
    el("q-counter").textContent = (idx + 1) + " / " + Q.length;
    el("q-stage").innerHTML =
      '<div class="q-card">' +
        '<div class="q-kicker">' + esc(I18N.t("quiz.question", { n: idx + 1 })) + "</div>" +
        "<h2>" + esc(P(item.q)) + "</h2>" +
        '<div class="q-opts">' +
          item.a.map(function (o, i) {
            return '<button class="q-opt" data-i="' + i + '" type="button"><span></span>' + esc(P(o.t)) + "</button>";
          }).join("") +
        "</div>" +
        (idx > 0 ? '<button class="q-back" id="q-back" type="button">' + esc(I18N.t("quiz.back")) + "</button>" : "") +
      "</div>";

    el("q-stage").querySelectorAll(".q-opt").forEach(function (b) {
      b.onclick = function () {
        b.classList.add("picked");
        answers[idx] = parseInt(b.dataset.i, 10);
        setTimeout(next, 180);
      };
    });
    var back = el("q-back");
    if (back) back.onclick = function () { idx = Math.max(0, idx - 1); renderQuestion(); };
  }

  function next() {
    idx++;
    if (idx >= Q.length) return showResult();
    renderQuestion();
  }

  function showResult() {
    finished = true;
    var dims = { debug: 0, text: 0, auto: 0, learn: 0, ops: 0 };
    var counts = {};
    answers.forEach(function (ai, qi) {
      var opt = Q[qi].a[ai];
      if (!opt) return;
      Object.keys(opt.s || {}).forEach(function (k) { dims[k] += opt.s[k]; });
      if (opt.alt) counts[opt.alt] = (counts[opt.alt] || 0) + 1;
    });
    var max = maxScores();
    var pctDims = {};
    var totalGot = 0, totalMax = 0;
    Object.keys(dims).forEach(function (k) {
      pctDims[k] = max[k] ? Math.round(dims[k] / max[k] * 100) : 0;
      totalGot += dims[k]; totalMax += max[k];
    });
    var pct = Math.round(totalGot / totalMax * 100);
    var v = verdict(pct);
    var alts = altRoles(counts, pctDims, pct);

    el("q-progress-fill").style.width = "100%";
    el("q-counter").textContent = Q.length + " / " + Q.length;

    var bars = Object.keys(DIMS).map(function (k) {
      var p = pctDims[k];
      var cls = p >= 70 ? "hi" : (p >= 45 ? "mid" : "lo");
      return '<div class="q-bar"><div class="q-bar-top"><span>' + DIMS[k].icon + " " + esc(P(DIMS[k].label)) +
             "</span><b>" + esc(I18N.t("common.pct", { n: p })) + "</b></div>" +
             '<div class="q-bar-track"><i class="' + cls + '" style="width:' + p + '%"></i></div></div>';
    }).join("");

    el("q-stage").innerHTML =
      '<div class="q-result q-' + v.tier + '">' +
        '<div class="q-score"><div class="q-score-num">' + esc(I18N.t("common.pct", { n: pct })) +
          "</div><span>" + esc(I18N.t("quiz.fit")) + "</span></div>" +
        "<h2>" + esc(P(v.title)) + "</h2>" +
        "<p>" + P(v.body) + "</p>" +
        '<div class="q-bars">' + bars + "</div>" +
        (alts.length
          ? '<div class="q-alts"><b>' + esc(I18N.t("quiz.altsTitle")) + "</b><ul><li>" +
            alts.map(P).join("</li><li>") + "</li></ul></div>"
          : "") +
        '<div class="q-disclaimer">' + I18N.t("quiz.disclaimer") + "</div>" +
        '<div class="q-actions">' +
          (pct >= 42
            ? '<a class="btn-neon" href="app.html">' + esc(I18N.t("quiz.ctaReady")) + "</a>"
            : '<a class="btn-neon" href="tutorial.html">' + esc(I18N.t("quiz.ctaTerminal")) + "</a>") +
          '<button class="btn-ghost" id="q-retry" type="button">' + esc(I18N.t("quiz.retry")) + "</button>" +
        "</div>" +
      "</div>";

    if (typeof FX !== "undefined" && pct >= 60) FX.burstCenter({ count: 30 });
    var rt = el("q-retry");
    if (rt) rt.onclick = function () { idx = 0; answers = []; finished = false; renderQuestion(); };
    if (onFinish) onFinish(BADGE, pct);
  }

  function mount(r, opts) {
    root = r; onFinish = (opts || {}).onFinish || null;
    idx = 0; answers = []; finished = false;
    renderQuestion();
  }

  return { mount: mount, BADGE: BADGE, count: Q.length };
})();
