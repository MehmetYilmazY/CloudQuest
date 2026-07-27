/* =========================================================================
   CloudQuest — Paylaşılabilir başarı kartı
   Oyuncunun profilini 1200x630 (LinkedIn/OG oranı) bir PNG'ye çizer.
   Tamamen istemci tarafı: sunucu yok, veri dışarı çıkmaz.
   Kullanım:  ShareCard.build(player).then(canvas => ...)
              ShareCard.download(player)  /  ShareCard.copy(player)
   ========================================================================= */
var ShareCard = (function () {
  "use strict";

  const W = 1200, H = 630;
  const C = {
    bg1: "#0a1020", bg2: "#05070d",
    neon: "#22d3ee", magenta: "#c084fc", green: "#4ade80",
    text: "#e6eef8", muted: "#7d8ea6", gold: "#fbbf24",
    border: "#17263d", panel: "#0c1524"
  };
  const MONO = '"Cascadia Code","JetBrains Mono","Consolas",ui-monospace,monospace';

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function svgToImage(svg) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }

  /* Story ilerlemesi (lab'lar hariç — kampanya yüzdesi) */
  function storyStats(p) {
    var total = (typeof QUESTS !== "undefined") ? QUESTS.length : 0;
    var done = total ? QUESTS.filter(function (q) { return p.completed.indexOf(q.id) !== -1; }).length : 0;
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function labDone(p) {
    if (typeof MODULES === "undefined") return 0;
    var n = 0;
    MODULES.forEach(function (m) {
      if (m.status === "active" && m.quests) {
        n += m.quests.filter(function (q) { return p.completed.indexOf(q.id) !== -1; }).length;
      }
    });
    return n;
  }

  async function build(p) {
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    var s = storyStats(p);

    /* --- arka plan --- */
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, C.bg1); g.addColorStop(1, C.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // neon ışıma
    var glow = ctx.createRadialGradient(W * 0.18, H * 0.3, 20, W * 0.18, H * 0.3, 520);
    glow.addColorStop(0, "rgba(34,211,238,0.16)"); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // ızgara
    ctx.strokeStyle = "rgba(56,189,248,0.07)"; ctx.lineWidth = 1;
    for (var x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // dış çerçeve
    ctx.strokeStyle = C.neon; ctx.lineWidth = 3;
    rr(ctx, 14, 14, W - 28, H - 28, 24); ctx.stroke();
    ctx.strokeStyle = "rgba(34,211,238,0.25)"; ctx.lineWidth = 1;
    rr(ctx, 26, 26, W - 52, H - 52, 18); ctx.stroke();

    /* --- başlık --- */
    ctx.font = "700 26px " + MONO;
    ctx.fillStyle = C.neon; ctx.textBaseline = "top";
    ctx.fillText("☁  CLOUDQUEST", 60, 52);
    ctx.font = "16px " + MONO; ctx.fillStyle = C.muted;
    ctx.fillText("CLOUD ENGINEERING RPG", 60, 86);

    /* --- avatar --- */
    var AX = 62, AY = 148, AS = 200;
    try {
      var img = await svgToImage(avatarSVG(p.avatar || 0, AS));
      ctx.save(); rr(ctx, AX, AY, AS, AS, 20); ctx.clip();
      ctx.drawImage(img, AX, AY, AS, AS); ctx.restore();
    } catch (e) {
      ctx.fillStyle = C.panel; rr(ctx, AX, AY, AS, AS, 20); ctx.fill();
    }
    ctx.strokeStyle = C.neon; ctx.lineWidth = 2;
    rr(ctx, AX, AY, AS, AS, 20); ctx.stroke();

    /* --- isim / rank --- */
    var TX = AX + AS + 42;
    ctx.font = "800 54px " + MONO; ctx.fillStyle = C.text;
    var name = String(p.name || "engineer");
    if (ctx.measureText(name).width > 620) {
      while (name.length > 4 && ctx.measureText(name + "…").width > 620) name = name.slice(0, -1);
      name += "…";
    }
    ctx.fillText(name, TX, 150);
    ctx.font = "600 26px " + MONO; ctx.fillStyle = C.magenta;
    ctx.fillText(String(p.rank || ""), TX, 214);

    /* --- istatistik kutuları --- */
    var stats = [
      ["LEVEL", String(p.level || 1)],
      ["QUEST", s.done + "/" + s.total],
      ["LAB", String(labDone(p))],
      ["ROZET", String((p.badges || []).length)]
    ];
    var bw = 148, bh = 84, bx = TX, by = 262;
    stats.forEach(function (st, i) {
      var X = bx + i * (bw + 14);
      ctx.fillStyle = "rgba(12,21,36,0.9)"; rr(ctx, X, by, bw, bh, 12); ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; rr(ctx, X, by, bw, bh, 12); ctx.stroke();
      ctx.textAlign = "center";
      ctx.font = "800 32px " + MONO; ctx.fillStyle = C.neon;
      ctx.fillText(st[1], X + bw / 2, by + 14);
      ctx.font = "14px " + MONO; ctx.fillStyle = C.muted;
      ctx.fillText(st[0], X + bw / 2, by + 54);
      ctx.textAlign = "left";
    });

    /* --- ilerleme çubuğu --- */
    var PX = AX, PY = 396, PW = W - 2 * AX, PH = 22;
    ctx.font = "16px " + MONO; ctx.fillStyle = C.muted;
    ctx.fillText("CLOUD ENGINEER HAZIRLIĞI", PX, PY - 28);
    ctx.textAlign = "right";
    ctx.font = "700 20px " + MONO; ctx.fillStyle = s.pct === 100 ? C.green : C.neon;
    ctx.fillText("%" + s.pct, PX + PW, PY - 30);
    ctx.textAlign = "left";
    ctx.fillStyle = "#050b14"; rr(ctx, PX, PY, PW, PH, 11); ctx.fill();
    ctx.strokeStyle = C.border; rr(ctx, PX, PY, PW, PH, 11); ctx.stroke();
    if (s.pct > 0) {
      var fw = Math.max(PH, PW * s.pct / 100);
      var fg = ctx.createLinearGradient(PX, 0, PX + fw, 0);
      fg.addColorStop(0, C.green); fg.addColorStop(1, C.neon);
      ctx.fillStyle = fg; rr(ctx, PX, PY, fw, PH, 11); ctx.fill();
    }

    /* --- rozetler --- */
    var badges = (p.badges || []).slice();
    ctx.font = "16px " + MONO; ctx.fillStyle = C.muted;
    ctx.fillText("ROZETLER", PX, 448);

    var cx = PX, cy = 478, rowH = 42, maxRows = 2, row = 0, shown = 0;
    ctx.font = "18px " + MONO;
    for (var i = 0; i < badges.length; i++) {
      var label = String(badges[i]);
      var tw = ctx.measureText(label).width;
      var cw = tw + 30;
      if (cx + cw > PX + PW - 90) {           // satır doldu
        row++; if (row >= maxRows) break;
        cx = PX; cy += rowH;
      }
      ctx.fillStyle = "rgba(251,191,36,0.10)"; rr(ctx, cx, cy, cw, 34, 17); ctx.fill();
      ctx.strokeStyle = "rgba(251,191,36,0.40)"; ctx.lineWidth = 1; rr(ctx, cx, cy, cw, 34, 17); ctx.stroke();
      ctx.fillStyle = "#f4e9c8"; ctx.fillText(label, cx + 15, cy + 8);
      cx += cw + 10; shown++;
    }
    if (shown < badges.length) {
      var rest = "+" + (badges.length - shown);
      ctx.fillStyle = C.muted; ctx.font = "18px " + MONO;
      ctx.fillText(rest, cx + 4, cy + 8);
    }
    if (badges.length === 0) {
      ctx.fillStyle = C.muted; ctx.font = "18px " + MONO;
      ctx.fillText("(henüz rozet yok)", PX, 480);
    }

    /* --- alt bilgi --- */
    ctx.font = "16px " + MONO; ctx.fillStyle = C.muted;
    ctx.fillText("cloud-quest.vercel.app", PX, H - 62);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(192,132,252,0.9)";
    ctx.fillText("terminalde öğren · oynayarak ilerle", PX + PW, H - 62);
    ctx.textAlign = "left";

    return cv;
  }

  function fileName(p) {
    var n = String(p.name || "engineer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return "cloudquest-" + (n || "engineer") + ".png";
  }

  async function download(p) {
    var cv = await build(p);
    var a = document.createElement("a");
    a.download = fileName(p);
    a.href = cv.toDataURL("image/png");
    a.click();
    return true;
  }

  async function copy(p) {
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") return false;
    var cv = await build(p);
    var blob = await new Promise(function (r) { cv.toBlob(r, "image/png"); });
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  }

  return { build: build, download: download, copy: copy };
})();
