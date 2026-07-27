/* =========================================================================
   CloudQuest — Oyun motoru + ekran orkestrasyonu
   Akış: LOADER -> AUTH (giriş/kayıt) -> APP (terminal) <-> PROFİL
   Bağımlılıklar: content.js (CHAPTERS/QUESTS/SHOP), avatars.js (AVATARS/avatarSVG),
   auth.js (Auth). Kayıt: aktif hesabın profilinde (Auth).
   ========================================================================= */

(function () {
  "use strict";

  const MAX_WRONG_BEFORE_ANSWER = 3;
  const ANSWER_COST = 25;              // Tab/hint ile cevabı görmenin kredi bedeli
  const START_CREDITS = 60;            // başlangıç bakiyesi (~2 cevaplık tampon)

  /* ---------------- DOM ---------------- */
  const $ = function (id) { return document.getElementById(id); };
  const screenEl = $("screen");
  const inputEl  = $("cmd");
  const promptEl = $("prompt");
  const hud = {
    avatar:  $("hud-avatar"),
    name:    $("hud-name"),
    rank:    $("hud-rank"),
    level:   $("hud-level"),
    xpText:  $("hud-xp-text"),
    xpFill:  $("hud-xp-fill"),
    credits: $("hud-credits"),
    quests:  $("hud-quests"),
    badges:  $("hud-badges"),
    account: $("hud-account")
  };

  /* ---------------- State ---------------- */
  let player = null;
  let mode = "menu";           // 'menu' | 'quest'
  let activeQuest = null, objIndex = 0, wrongCount = 0;
  const history = []; let histPos = -1;

  /* ---------------- Rank & XP ---------------- */
  function rankFor(level) {
    if (level >= 12) return "Principal Cloud Wizard 🧙";
    if (level >= 10) return "Cloud Architect 🏛️";
    if (level >= 8)  return "Senior Cloud Engineer";
    if (level >= 5)  return "Cloud Engineer";
    if (level >= 3)  return "Junior Cloud Engineer";
    if (level >= 2)  return "Associate ☁️";
    return "Intern ☁️";
  }
  function xpToNext(level) { return level * 120; }

  function newProfile(name, avatar) {
    return {
      name: (name || "engineer").slice(0, 24),
      avatar: avatar || 0,
      level: 1, xp: 0, credits: START_CREDITS,
      rank: rankFor(1),
      completed: [], badges: [], freeHints: 0, story: []
    };
  }

  /* ---------------- Kalıcılık (aktif hesap profili) ---------------- */
  function save() { if (player) Auth.saveProfile(player); }

  /* ---------------- Ekrana yazma ---------------- */
  function print(text, cls) {
    const line = document.createElement("div");
    line.className = "line" + (cls ? " " + cls : "");
    line.textContent = text == null ? "" : text;
    screenEl.appendChild(line);
    screenEl.scrollTop = screenEl.scrollHeight;
    return line;
  }
  function blank() { print(""); }
  function rule() { print("─".repeat(56), "muted"); }
  function narrate(lines, cls) { (lines || []).forEach(function (l) { print(l, cls || "mentor"); }); }

  function echoCommand(cmd) {
    const line = document.createElement("div");
    line.className = "line cmd-echo";
    line.innerHTML = "<span class='p-user'>" + esc(promptText()) + "</span> " + esc(cmd);
    screenEl.appendChild(line);
    screenEl.scrollTop = screenEl.scrollHeight;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---------------- HUD ---------------- */
  function promptText() {
    if (mode === "quest") return player.name + "@aws:~$";
    return player.name + "@cloudquest:~$";
  }
  function refreshPrompt() { promptEl.textContent = promptText(); }

  function updateHud() {
    if (!player) return;
    hud.avatar.innerHTML = avatarSVG(player.avatar, 56);
    hud.name.textContent = player.name;
    hud.rank.textContent = player.rank;
    hud.level.textContent = player.level;
    const need = xpToNext(player.level);
    hud.xpText.textContent = player.xp + " / " + need + " XP";
    hud.xpFill.style.width = Math.min(100, Math.round((player.xp / need) * 100)) + "%";
    hud.credits.textContent = player.credits + " 💠";
    hud.quests.textContent = storyDone() + " / " + QUESTS.length;
    hud.badges.textContent = player.badges.length ? player.badges.join(", ") : "—";
    const acc = Auth.accountInfo();
    hud.account.textContent = acc ? acc.email : "—";
  }

  function addXp(amount) {
    player.xp += amount;
    print("   +" + amount + " XP", "xp");
    while (player.xp >= xpToNext(player.level)) {
      player.xp -= xpToNext(player.level);
      player.level++;
      player.rank = rankFor(player.level);
      blank();
      print("   ⭐ LEVEL UP!  →  Level " + player.level, "levelup");
      print("   Yeni rank: " + player.rank, "levelup");
      blank();
    }
    updateHud();
  }
  function addCredits(amount) {
    player.credits += amount;
    print("   +" + amount + " cloud credits 💠", "credit");
    updateHud();
  }

  /* ---------------- Quest yardımcıları ---------------- */
  // Aktif Advanced Lab quest'leri (hikâye QUESTS'ten ayrı; sayaçlara girmez)
  function labQuests() {
    var out = [];
    (typeof MODULES !== "undefined" ? MODULES : []).forEach(function (m) {
      if (m.status === "active" && m.quests) out = out.concat(m.quests);
    });
    return out;
  }
  function moduleOfQuest(id) {
    return (typeof MODULES !== "undefined" ? MODULES : []).filter(function (m) {
      return m.status === "active" && m.quests && m.quests.some(function (q) { return q.id === id; });
    })[0] || null;
  }
  function isLabQuest(q) { return q && !q.chapter; }
  // Sadece hikâye (kampanya) quest'lerinden kaç tanesi tamam
  function storyDone() {
    return QUESTS.filter(function (q) { return player.completed.indexOf(q.id) !== -1; }).length;
  }
  function questById(id) {
    return QUESTS.find(function (q) { return q.id === id; }) ||
           labQuests().filter(function (q) { return q.id === id; })[0];
  }
  function questStatus(q) {
    if (player.completed.indexOf(q.id) !== -1) return "done";
    for (var i = 0; i < q.requires.length; i++) {
      if (player.completed.indexOf(q.requires[i]) === -1) return "locked";
    }
    return "available";
  }
  function firstAvailableId() {
    var q = QUESTS.find(function (x) { return questStatus(x) === "available"; });
    return q ? q.id : "c1q1";
  }
  function pad(s, n) { s = String(s); while (s.length < n) s += " "; return s; }

  /* ---------------- Menü komutları ---------------- */
  function showHelp() {
    rule(); print("   KOMUTLAR", "title"); blank();
    [
      ["quests", "quest günlüğünü göster"],
      ["quest <id>", "bir questi başlat (örn: quest c1q1)"],
      ["map", "bölüm / ilerleme haritası"],
      ["home", "ana sayfaya (hub) dön"],
      ["guide", "başlangıç rehberi (6 dk, rozetli)"],
      ["labs", "gelecek modüller (yakında)"],
      ["lab <id>", "bir modülün detayı (örn: lab net)"],
      ["status  (me)", "karakter panelin"],
      ["profile", "profil sayfanı aç"],
      ["shop", "credit dükkânı"],
      ["buy <n>", "shop'tan ürün al"],
      ["roadmap", "6 aylık çalışma programı"],
      ["clear", "ekranı temizle"],
      ["reset", "ilerlemeni sıfırla (onaylı)"],
      ["logout", "hesaptan çık"],
      ["help  (?)", "bu liste"]
    ].forEach(function (r) { print("   " + pad(r[0], 16) + r[1], "help-row"); });
    blank();
    print("   Quest içindeyken: hint / Tab (cevabı göster — " + ANSWER_COST + " 💠, onay ister) · task · abandon", "muted");
    rule();
  }

  function showQuests() {
    rule(); print("   📜 QUEST GÜNLÜĞÜ", "title"); blank();
    QUESTS.forEach(function (q) {
      var st = questStatus(q);
      if (st === "done") print("   ✅ [" + q.id + "] " + q.title + "  (ch" + q.chapter + ")", "muted");
      else if (st === "available") print("   ▶  [" + q.id + "] " + q.title + "  (ch" + q.chapter + ")  +" + q.xp + " XP", "avail");
      else print("   🔒 [" + q.id + "] " + q.title + "  (önce: " + q.requires.join(", ") + ")", "locked");
    });
    blank(); print("   Başlatmak için:  quest <id>     (örn: quest " + firstAvailableId() + ")", "hintline"); rule();
  }

  function showMap() {
    rule(); print("   🗺️  CLOUDQUEST HARİTASI", "title"); blank();
    CHAPTERS.forEach(function (ch) {
      var qs = QUESTS.filter(function (q) { return q.chapter === ch.n; });
      var total = qs.length;
      var done = qs.filter(function (q) { return player.completed.indexOf(q.id) !== -1; }).length;
      var mark = total === 0 ? "  " : (done === total ? "✅" : (done > 0 ? "⏳" : "⬜"));
      var prog = total > 0 ? (done + "/" + total) : "—";
      print("   " + mark + "  Ch" + ch.n + ". " + pad(ch.title, 24) + " " + prog, (done === total && total > 0) ? "avail" : "");
      print("        " + ch.desc, "muted");
    });
    blank();
    print("   🔮 GELECEK MODÜLLER (yakında)", "hintline");
    MODULES.forEach(function (m) {
      var tag = m.status === "active" ? "✅" : "🔒";
      print("   " + tag + "  " + m.icon + " " + pad(m.title, 22) + "[" + m.id + "]", "locked");
    });
    print("   Detay: labs  ·  lab <id>", "muted");
    rule();
  }

  function showLabs() {
    rule(); print("   🔮 GELECEK MODÜLLER  (Advanced Labs — yakında)", "title"); blank();
    print("   8 bölümlük hikâyeyi bitirdikten sonra gelecek uzmanlık modülleri.", "mentor");
    print("   Şimdilik pasif; tek tek eklenecek. Ana ilerlemeni etkilemez.", "muted"); blank();
    MODULES.forEach(function (m) {
      var tag = m.status === "active" ? "✅ hazır" : "🔒 yakında";
      print("   " + m.icon + "  " + pad("[" + m.id + "]", 13) + pad(m.title, 20) + tag, m.status === "active" ? "avail" : "locked");
      print("        " + m.desc, "muted");
    });
    blank();
    print("   Bir modüle bakmak için:  lab <id>     (örn: lab net)", "hintline"); rule();
  }
  function showLab(id) {
    var m = MODULES.find(function (x) { return x.id === (id || "").toLowerCase(); });
    if (!m) { print("   ❌ Böyle bir modül yok: " + id + "   ('labs' ile listeye bak)", "err"); return; }
    rule(); print("   " + m.icon + "  MODÜL: " + m.title + "   [" + m.id + "]", "questhead");
    print("   " + m.desc, "teach"); blank();
    if (m.status === "active" && m.quests && m.quests.length) {
      blank(); print("   📋 LAB GÖREVLERİ", "title");
      m.quests.forEach(function (q) {
        var st = questStatus(q);
        if (st === "done") print("   ✅ [" + q.id + "] " + q.title, "muted");
        else if (st === "available") print("   ▶  [" + q.id + "] " + q.title + "   +" + q.xp + " XP", "avail");
        else print("   🔒 [" + q.id + "] " + q.title + "   (önce: " + q.requires.join(", ") + ")", "locked");
      });
      var nxt = m.quests.filter(function (q) { return questStatus(q) === "available"; })[0];
      blank();
      if (nxt) print("   Başlamak için:  quest " + nxt.id, "hintline");
      else print("   🎉 Bu lab'ı tamamladın!", "levelup");
    } else {
      print("   Kapsayacağı konular:", "muted");
      m.topics.forEach(function (t) { print("     • " + t, "help-row"); });
      blank();
      print("   🔒 Bu modül henüz PASİF (placeholder).", "locked");
      print("   [Nova]: Yerini ayırdım. Hazır olunca 'bunu ekleyelim' de, tane tane işleyelim.", "mentor");
    }
    rule();
  }

  function showStatus() {
    rule(); print("   👤 " + player.name, "title");
    print("   Rank    : " + player.rank, "cyan");
    print("   Level   : " + player.level + "   XP: " + player.xp + "/" + xpToNext(player.level), "xp");
    print("   Credits : " + player.credits + " 💠", "cyan");
    print("   Badges  : " + (player.badges.length ? player.badges.join(", ") : "(henüz yok)"), "credit");
    print("   Quest   : " + storyDone() + " / " + QUESTS.length + " tamamlandı", "muted");
    print("   (detaylı profil için: profile)", "hintline");
    rule();
  }

  function showShop() {
    rule(); print("   🛒 CLOUD SHOP   (credits ile al)", "title");
    print("   Bakiyen: " + player.credits + " 💠", "cyan"); blank();
    SHOP.forEach(function (item) {
      print("   " + item.id + ") " + item.icon + "  " + pad(item.name, 22) + item.cost + " 💠  — " + item.desc, "avail");
    });
    blank(); print("   Satın almak: buy <n>   (örn: buy 1)", "hintline"); rule();
  }
  function buy(nRaw) {
    var n = parseInt(nRaw, 10);
    var item = SHOP.find(function (i) { return i.id === n; });
    if (!item) { print("   ❌ Geçersiz seçim. 'shop' ile ürünleri gör.", "err"); return; }
    if (player.credits < item.cost) { print("   ❌ Yetersiz credit (" + item.cost + " gerekli).", "err"); return; }
    if (item.effect.badge && player.badges.indexOf(item.effect.badge) !== -1) { print("   Bu ünvana zaten sahipsin.", "hintline"); return; }
    player.credits -= item.cost;
    print("   🛍️  Satın alındı: " + item.name, "credit");
    if (item.effect.xp) addXp(item.effect.xp);
    if (item.effect.badge) { player.badges.push(item.effect.badge); print("   🏅 Yeni rozet: " + item.effect.badge, "levelup"); }
    if (item.effect.freeHints) { player.freeHints += item.effect.freeHints; print("   🧠 " + item.effect.freeHints + " ücretsiz ipucu eklendi.", "hintline"); }
    updateHud(); save();
  }

  function showRoadmap() {
    rule(); print("   📖 6 AYLIK YOL HARİTASI  (özet)", "title"); blank();
    [
      ["Ay 1", "Foundations — Linux, terminal, Git, ağın temeli   → Ch 1–2"],
      ["Ay 2", "Cloud Core — AWS: IAM, EC2, VPC, S3, RDS           → Ch 3"],
      ["Ay 3", "IaC — Terraform ile altyapıyı kodla                → Ch 4"],
      ["Ay 4", "Containers — Docker + Kubernetes                   → Ch 5"],
      ["Ay 5", "Otomasyon — CI/CD, GitHub Actions, observability   → Ch 6–7"],
      ["Ay 6", "Ustalık — Güvenlik, maliyet, AWS SAA sertifikası   → Ch 8"]
    ].forEach(function (r) { print("   " + pad(r[0], 8) + r[1], "help-row"); });
    blank();
    print("   Döngü:  Öğren (teori) → Oyna (bu oyun) → Uygula (gerçek AWS Free Tier).", "hintline");
    print("   %20 teori, %80 elin klavyede. Public GitHub portföyü = en iyi CV.", "mentor");
    rule();
  }

  /* ---------------- Quest oynatma ---------------- */
  function clearScreen() { screenEl.innerHTML = ""; }

  /* ---------------- Story (perde) beat'leri ---------------- */
  function trackOfChapter(ch) {
    return TRACKS.filter(function (t) { return t.chapters.indexOf(ch) !== -1; })[0] || null;
  }
  function trackQuests(track) {
    return QUESTS.filter(function (q) { return track.chapters.indexOf(q.chapter) !== -1; });
  }
  function showStoryBeat(beatId, title, lines) {
    if (!lines || !lines.length) return;
    player.story = player.story || [];
    if (player.story.indexOf(beatId) !== -1) return;
    blank();
    print("   ═══  " + title + "  " + "═".repeat(Math.max(2, 44 - title.length)), "actline");
    narrate(lines, "story");
    print("   " + "═".repeat(52), "actline");
    blank();
    player.story.push(beatId); save();
  }
  function showActIntro(track) {
    if (!STORY || !STORY.acts || !track) return;
    var a = STORY.acts[track.id]; if (!a) return;
    showStoryBeat("act:" + track.id + ":intro", "▶ " + a.title, a.intro);
  }
  function showActOutro(track) {
    if (!STORY || !STORY.acts || !track) return;
    var a = STORY.acts[track.id]; if (!a) return;
    showStoryBeat("act:" + track.id + ":outro", "✓ " + a.title, a.outro);
  }
  function showQuestBeat(qid, when) {
    if (!STORY || !STORY.beats) return;
    var b = STORY.beats[qid];
    if (b && b.when === when) showStoryBeat("beat:" + qid, b.title, b.lines);
  }

  function startQuest(id) {
    var q = questById(id);
    if (!q) { print("   ❌ Böyle bir quest yok: " + id, "err"); return; }
    var st = questStatus(q);
    if (st === "done")   { print("   ✅ Bu quest zaten tamamlandı.", "hintline"); return; }
    if (st === "locked") { print("   🔒 Kilitli. Önce tamamla: " + q.requires.join(", "), "err"); return; }
    activeQuest = q; objIndex = 0; wrongCount = 0; mode = "quest"; refreshPrompt();
    clearScreen(); rule();
    print("   ▶ QUEST: " + q.title + "   [" + q.id + "]", "questhead"); rule();
    var track = trackOfChapter(q.chapter);
    if (track && trackQuests(track)[0].id === q.id) showActIntro(track);   // perde açılışı
    showQuestBeat(q.id, "intro");
    narrate(q.brief, "mentor"); blank();
    print("   (yardım: hint / Tab = cevap, " + ANSWER_COST + " 💠 · task = görevi tekrar · abandon = çık)", "muted"); blank();
    showObjective();
  }
  function showObjective() {
    var obj = activeQuest.objectives[objIndex];
    print("   ── Görev " + (objIndex + 1) + "/" + activeQuest.objectives.length + " " + "─".repeat(28), "objhead");
    print("   🎯 " + obj.task, "task");
    print("   💡 " + obj.teach, "teach");
  }
  function handleQuestInput(cmd) {
    var lower = cmd.toLowerCase();
    if (/^(abandon|exit|back|çık|cik)$/.test(lower)) { print("   ↩  Quest'ten çıkıldı (ilerleme kaydedilmedi).", "hintline"); backToMenu(); return; }
    if (/^(hint|ipucu)$/.test(lower)) { revealHint(false); return; }
    if (/^(task|görev|gorev|look)$/.test(lower)) { print("   🎯 " + activeQuest.objectives[objIndex].task, "task"); return; }
    if (cmd.trim() === "") return;
    var obj = activeQuest.objectives[objIndex];
    var ok = CQParser.match(cmd, obj.expect);
    if (ok) {
      print("   ✔ " + obj.success, "ok");
      wrongCount = 0; objIndex++;
      if (objIndex >= activeQuest.objectives.length) finishQuest();
      else { blank(); showObjective(); }
    } else {
      wrongCount++;
      if (wrongCount >= MAX_WRONG_BEFORE_ANSWER) {
        print("   ✖ Tam olmadı. Yeni başlayan modunda yardım: doğru komut ↓", "err");
        revealHint(true); wrongCount = 0;
      } else print("   ✖ Tam olmadı. Tekrar dene — " + (MAX_WRONG_BEFORE_ANSWER - wrongCount) + " denemede daha bilemezsen cevabı ücretsiz gösteririm.", "err");
    }
  }
  function revealHint(auto) {
    if (auto) {   // 3 yanlış sonrası: ücretsiz güvenlik ağı
      print("   💬 İpucu — şunu yaz:  " + activeQuest.objectives[objIndex].hint, "hintline");
      return;
    }
    payForAnswer(function (obj) {          // elle istenen ipucu: ücretli + onaylı
      print("   💬 İpucu — şunu yaz:  " + obj.hint, "hintline");
    });
  }
  function finishQuest() {
    var q = activeQuest;
    blank(); rule(); narrate(q.complete, "mentor"); blank();
    showQuestBeat(q.id, "complete");
    addXp(q.xp); addCredits(q.credits);
    if (q.badge && player.badges.indexOf(q.badge) === -1) { player.badges.push(q.badge); print("   🏅 Yeni rozet: " + q.badge, "levelup"); }
    if (player.completed.indexOf(q.id) === -1) player.completed.push(q.id);
    updateHud(); save(); rule();
    var track = trackOfChapter(q.chapter);
    if (track && trackQuests(track).slice(-1)[0].id === q.id) showActOutro(track);   // perde kapanışı
    if (isLabQuest(q)) {
      var mod = moduleOfQuest(q.id);
      var nextLab = mod && mod.quests.filter(function (x) { return questStatus(x) === "available"; })[0];
      if (nextLab) print("   ➡  Sıradaki: quest " + nextLab.id, "hintline");
      else print("   🎉 " + (mod ? mod.icon + " " + mod.title : "Lab") + " tamamlandı! İyi iş.", "levelup");
    } else if (storyDone() === QUESTS.length) {
      blank(); print("   🎉 TÜM QUESTLER TAMAM! Job-ready Cloud Engineer'sın. 🎉", "levelup");
    } else {
      print("   ➡  Sıradaki: quest " + firstAvailableId(), "hintline");
    }
    backToMenu();
  }
  function backToMenu() { activeQuest = null; objIndex = 0; wrongCount = 0; mode = "menu"; refreshPrompt(); }

  /* ---------------- Banner + terminal boot ---------------- */
  function showBanner() {
    [
      "   ____  _                 _  ___                  _   ",
      "  / ___|| |  ___   _   _  __| |/ _ \\ _   _  ___  ___| |_ ",
      " | |    | | / _ \\ | | | |/ _` | | | | | | |/ _ \\/ __| __|",
      " | |___ | || (_) || |_| | (_| | |_| | |_| |  __/\\__ \\ |_ ",
      "  \\____||_| \\___/  \\__,_|\\__,_|\\__\\_\\\\__,_|\\___||___/\\__|"
    ].forEach(function (l) { print(l, "banner"); });
    print("          >> Cloud Engineering RPG  ::  live terminal <<", "tagline");
    rule();
  }
  function terminalBoot() {
    clearScreen(); showBanner();
    var isNew = player.completed.length === 0 && player.level === 1 && player.xp === 0;
    print("   Hoş geldin, " + player.name + "!  (" + player.rank + ")", "ok");
    blank();
    if (isNew) {
      if (STORY && STORY.prologue) showStoryBeat("prologue", STORY.startup + " — Prolog", STORY.prologue);
      narrate([
        "[Nova]: Takılırsan `hint` yaz — 3 yanlıştan sonra doğru komutu gösteririm.",
        "Başlamak için: `quests` (görevler) → `quest c1q1`."
      ], "mentor");
      blank(); print("   Komut listesi için: help", "hintline");
    } else {
      print("   Kaldığın yerden devam: " + storyDone() + "/" + QUESTS.length + " quest tamam.", "muted");
      if (storyDone() < QUESTS.length) print("   ➡  Sıradaki: quest " + firstAvailableId(), "hintline");
      else print("   🎉 Tüm questleri bitirdin! `map` ile zaferini gör.", "levelup");
    }
  }

  /* ---------------- Komut ayrıştırıcı ---------------- */
  function handleMenuInput(raw) {
    var cmd = raw.trim();
    var parts = cmd.split(/\s+/);
    var verb = (parts[0] || "").toLowerCase();
    var arg = parts.slice(1).join(" ").trim();
    switch (verb) {
      case "": break;
      case "help": case "?": showHelp(); break;
      case "quests": case "quest-log": showQuests(); break;
      case "quest": case "start":
        if (arg) startQuest(arg.toLowerCase()); else print("   Kullanım: quest <id>   (bkz: quests)", "hintline"); break;
      case "map": showMap(); break;
      case "home": case "anasayfa": backToHome(); break;
      case "guide": case "rehber": openGuide(); break;
      case "labs": case "modules": showLabs(); break;
      case "lab": case "module":
        if (arg) showLab(arg); else print("   Kullanım: lab <id>   (bkz: labs)", "hintline"); break;
      case "status": case "me": showStatus(); break;
      case "profile": openProfile(); break;
      case "shop": showShop(); break;
      case "buy": buy(arg); break;
      case "roadmap": showRoadmap(); break;
      case "clear": case "cls": clearScreen(); showBanner(); break;
      case "reset": doReset(); break;
      case "logout": case "signout": doLogout(); break;
      default: print("   Bilinmeyen komut: '" + verb + "'.  'help' yaz.", "err");
    }
  }

  /* ---------------- Girdi olayları ---------------- */
  function submit(raw) {
    echoCommand(raw);
    if (raw.trim() !== "") { history.push(raw); if (history.length > 100) history.shift(); }
    histPos = history.length;
    if (mode === "quest") handleQuestInput(raw); else handleMenuInput(raw);
  }
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var v = inputEl.value; inputEl.value = ""; submit(v); }
    else if (e.key === "ArrowUp") {
      if (history.length) { histPos = Math.max(0, histPos - 1); inputEl.value = history[histPos] || ""; e.preventDefault();
        setTimeout(function () { inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length; }, 0); }
    } else if (e.key === "ArrowDown") {
      if (history.length) { histPos = Math.min(history.length, histPos + 1); inputEl.value = history[histPos] || ""; e.preventDefault(); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (mode === "quest" && activeQuest) requestAnswer();
    }
  });

  /* Cevabı açmak bedava değil: önce onay, sonra ücret.
     Ücretsiz ipucu hakkı (shop) varsa krediden düşmez, haktan düşer.
     3 yanlış denemeden sonraki otomatik gösterim ücretsizdir (güvenlik ağı). */
  function payForAnswer(onGranted) {
    var obj = activeQuest.objectives[objIndex];
    var useFree = player.freeHints > 0;

    if (!useFree && player.credits < ANSWER_COST) {
      print("   ❌ Yetersiz kredi. Cevabı görmek " + ANSWER_COST + " 💠 tutuyor (bakiyen: " + player.credits + " 💠).", "err");
      print("   Ücretsiz yol: 3 kez yanlış denersen doğru komutu bedava gösteririm.", "hintline");
      return;
    }

    cqConfirm({
      icon: "question",
      title: "Cevabı göstereyim mi?",
      html: useFree
        ? "🧠 <b>Ücretsiz ipucu hakkın</b> kullanılacak.<br>Kalan hak: <b>" + player.freeHints + "</b>"
        : "Bedeli: <b>" + ANSWER_COST + " 💠</b> · Bakiyen: <b>" + player.credits + " 💠</b>" +
          "<br><span style='opacity:.7'>3 kez yanlış denersen ücretsiz gösteririm.</span>",
      confirmText: useFree ? "Hakkımı kullan" : "Evet, " + ANSWER_COST + " 💠 öde",
      cancelText: "Kendim deneyeceğim"
    }).then(function (ok) {
      inputEl.focus();
      if (!ok) return;
      // Onay beklenirken oyuncu ilerlemiş olabilir; hâlâ aynı adımda mıyız?
      if (mode !== "quest" || !activeQuest || activeQuest.objectives[objIndex] !== obj) return;

      if (useFree) {
        player.freeHints--;
        print("   🧠 Ücretsiz ipucu kullanıldı (kalan: " + player.freeHints + ").", "hintline");
      } else {
        player.credits -= ANSWER_COST;
        print("   💠 -" + ANSWER_COST + " kredi (kalan: " + player.credits + ").", "credit");
      }
      updateHud(); save();
      onGranted(obj);
    });
  }
  // Tab: cevabı doğrudan giriş kutusuna yazar.
  function requestAnswer() { payForAnswer(function (obj) { inputEl.value = obj.hint; }); }
  $("terminal").addEventListener("click", function () { inputEl.focus(); });

  /* =======================================================================
     PROFİL SAYFASI
     ======================================================================= */
  function openProfile() {
    renderProfile();
    $("profile-page").classList.remove("hidden");
  }
  function closeProfile() { $("profile-page").classList.add("hidden"); inputEl.focus(); }

  function renderProfile() {
    $("profile-avatar").innerHTML = avatarSVG(player.avatar, 132);
    $("profile-name").textContent = player.name;
    $("profile-rank").textContent = player.rank;
    var acc = Auth.accountInfo();
    $("profile-email").textContent = acc ? acc.email : "";

    var done = storyDone(), total = QUESTS.length;
    var stats = [
      ["Level", player.level],
      ["XP", player.xp + "/" + xpToNext(player.level)],
      ["Credits", player.credits + " 💠"],
      ["Quests", done + " / " + total],
      ["Rozet", player.badges.length]
    ];
    $("profile-stats").innerHTML = stats.map(function (s) {
      return "<div class='stat-tile'><div class='stat-val'>" + s[1] + "</div><div class='stat-key'>" + s[0] + "</div></div>";
    }).join("");

    var readyPct = Math.round((done / total) * 100);
    $("ready-fill").style.width = readyPct + "%";
    $("ready-text").textContent = "%" + readyPct + (readyPct === 100 ? " — Job-ready! 🚀" : "");

    $("badge-grid").innerHTML = player.badges.length
      ? player.badges.map(function (b) { return "<span class='badge-chip'>" + esc(b) + "</span>"; }).join("")
      : "<span class='muted-inline'>Henüz rozet yok — quest bitir!</span>";

    // Modül (track) ilerlemeleri
    var trackStats = TRACKS.map(function (tr) {
      var qs = QUESTS.filter(function (q) { return tr.chapters.indexOf(q.chapter) !== -1; });
      var d = qs.filter(function (q) { return player.completed.indexOf(q.id) !== -1; }).length;
      return { tr: tr, quests: qs, done: d, total: qs.length,
               pct: qs.length ? Math.round((d / qs.length) * 100) : 0,
               complete: qs.length > 0 && d === qs.length };
    });
    // Şu anki modül = tamamlanmamış ilk modül; hepsi bittiyse sonuncusu
    var cur = trackStats.filter(function (s) { return !s.complete; })[0] || trackStats[trackStats.length - 1];

    // Tamamlanan modüller şeridi (flex) — hepsi durumu ile görünür
    $("modules-row").innerHTML = trackStats.map(function (s) {
      var state = s.complete ? "done" : (s === cur ? "current" : "locked");
      return "<span class='mod-chip mod-" + state + "'>" + s.tr.icon + " " + esc(s.tr.title) +
               "<span class='mod-chip-pct'>" + (s.complete ? "✓" : "%" + s.pct) + "</span>" +
             "</span>";
    }).join("");

    // Şu anki modülün eğitimleri + yüzdesi
    $("cur-module-name").textContent = cur.tr.title;
    $("cur-module-pct").textContent = "%" + cur.pct + " (" + cur.done + "/" + cur.total + ")";
    $("cur-module-fill").style.width = cur.pct + "%";
    $("trainings").innerHTML = cur.quests.map(function (q) {
      var st = questStatus(q);
      var icon = st === "done" ? "✅" : (st === "available" ? "▶" : "🔒");
      var cls = st === "done" ? "tr-done" : (st === "available" ? "tr-part" : "tr-todo");
      return "<div class='train-row " + cls + "'>" +
               "<span class='train-icon'>" + icon + "</span>" +
               "<span class='train-name'>" + esc(q.title) + "</span>" +
               "<span class='train-prog'>ch" + q.chapter + " · +" + q.xp + "xp</span>" +
             "</div>";
    }).join("");

  }

  /* ---- Avatar seçim modal'ı (ayrı popup) ---- */
  function openAvatarModal() {
    renderAvatarPicker("modal-avatars", player.avatar, function (i) {
      player.avatar = i; save(); updateHud();
      $("profile-avatar").innerHTML = avatarSVG(player.avatar, 132);  // profil önizlemesini güncelle
    });
    $("avatar-modal").classList.remove("hidden");
  }
  function closeAvatarModal() { $("avatar-modal").classList.add("hidden"); }

  /* ---- Başlangıç rehberi (scroll-driven) ---- */
  function openGuide() {
    var box = $("guide");
    // Önce görünür yap: IntersectionObserver ölçülebilir bir kök ister,
    // display:none iken kurulursa ilk bölümün kesişimini kaçırır.
    box.classList.remove("hidden");
    document.body.classList.add("guide-open");
    Guide.mount(box, {
      onComplete: function (badge) {
        if (player.badges.indexOf(badge) === -1) {
          player.badges.push(badge);
          player.xp += 40;
          save(); updateHud();
          cqToast("success", "Rozet kazandın: " + badge + "  (+40 XP)");
        }
      }
    });
    box.querySelector("#guide-close").onclick = closeGuide;
    var cta = box.querySelector("#guide-finish");
    if (cta) cta.onclick = closeGuide;
  }
  function closeGuide() {
    $("guide").classList.add("hidden");
    document.body.classList.remove("guide-open");
    Guide.unmount();
    renderHome();       // rozet/XP değişmiş olabilir
  }

  /* ---- Paylaşılabilir başarı kartı ---- */
  function openShareModal() {
    var box = $("share-preview");
    box.innerHTML = "<div class='share-loading'>Kart hazırlanıyor…</div>";
    $("share-modal").classList.remove("hidden");
    ShareCard.build(player).then(function (cv) {
      box.innerHTML = "";
      cv.classList.add("share-canvas");
      box.appendChild(cv);
    }).catch(function (e) {
      box.innerHTML = "<div class='share-loading'>Kart oluşturulamadı: " + esc(e.message || e) + "</div>";
    });
  }
  function closeShareModal() { $("share-modal").classList.add("hidden"); }

  function doLogout() {
    cqConfirm({
      icon: "question", title: "Çıkış yapılsın mı?",
      html: "İlerlemen kayıtlı — tekrar giriş yapınca kaldığın yerden devam edersin.",
      confirmText: "Çıkış yap", cancelText: "Kal"
    }).then(function (ok) {
      if (!ok) return;
      save();
      // Bekleyen yazmalar buluta gitsin, sonra oturumu kapat.
      Auth.logout().then(function () {
        cqToast("success", "Çıkış yapıldı");
        setTimeout(function () { location.reload(); }, 650);
      });
    });
  }

  function doReset() {
    cqConfirm({
      icon: "warning", title: "İlerlemeyi sıfırla?",
      html: "Level, XP, credits, tamamlanan questler ve rozetler <b>silinecek</b>.<br>Hesabın ve avatarın kalır.",
      confirmText: "Evet, sıfırla", cancelText: "Vazgeç"
    }).then(function (ok) {
      if (!ok) { print("   İptal edildi. İlerlemen duruyor.", "hintline"); return; }
      player.level = 1; player.xp = 0; player.credits = START_CREDITS;
      player.rank = rankFor(1); player.completed = []; player.badges = []; player.freeHints = 0; player.story = [];
      save(); updateHud();
      terminalBooted = false;             // terminale dönünce welcome yeniden gösterilsin
      print("   ♻ İlerleme sıfırlandı. Temiz başlangıç!", "levelup");
      cqToast("success", "İlerleme sıfırlandı");
      backToHome();
    });
  }

  /* =======================================================================
     AVATAR PICKER
     ======================================================================= */
  function renderAvatarPicker(containerId, selected, onPick) {
    var c = $(containerId);
    c.innerHTML = "";
    AVATARS.forEach(function (a, i) {
      var cell = document.createElement("button");
      cell.type = "button";
      cell.className = "avatar-cell" + (i === selected ? " selected" : "");
      cell.innerHTML = avatarSVG(i, 72) + "<span class='avatar-name'>" + a.label + "</span>";
      cell.addEventListener("click", function () {
        c.querySelectorAll(".avatar-cell").forEach(function (x) { x.classList.remove("selected"); });
        cell.classList.add("selected");
        onPick(i);
      });
      c.appendChild(cell);
    });
  }

  /* =======================================================================
     AUTH EKRANI
     ======================================================================= */
  let regAvatar = 0;

  function setupAuthScreen() {
    // sekmeler
    $("tab-login").addEventListener("click", function () { switchAuthTab("login"); });
    $("tab-register").addEventListener("click", function () { switchAuthTab("register"); });

    renderAvatarPicker("reg-avatars", 0, function (i) { regAvatar = i; });

    $("form-login").addEventListener("submit", function (e) {
      e.preventDefault();
      $("login-err").textContent = "";
      var btn = $("form-login").querySelector("button[type=submit]");
      var email = $("login-email").value, pass = $("login-pass").value;
      busy(btn, true, "Giriş yapılıyor…");
      Auth.login(email, pass).then(function (r) {
        busy(btn, false);
        if (!r.ok) { $("login-err").textContent = r.error; return; }
        enterAppFromAuth();
      });
    });

    $("form-register").addEventListener("submit", function (e) {
      e.preventDefault();
      $("reg-err").textContent = "";
      var btn = $("form-register").querySelector("button[type=submit]");
      var name = $("reg-name").value.trim() || "engineer";
      var email = $("reg-email").value, pass = $("reg-pass").value;
      var profile = newProfile(name, regAvatar);
      busy(btn, true, "Hesap oluşturuluyor…");
      Auth.register({ email: email, password: pass, profile: profile }).then(function (r) {
        busy(btn, false);
        if (r.ok) { enterAppFromAuth(); return; }
        if (r.needsConfirmation) {         // e-posta doğrulaması bekleniyor
          $("reg-err").textContent = "";
          cqInfo("📬 E-postanı doğrula", r.error);
          switchAuthTab("login");
          $("login-email").value = email;
          return;
        }
        $("reg-err").textContent = r.error;
      });
    });

    // Şifremi unuttum
    $("forgot-link").addEventListener("click", function (e) {
      e.preventDefault();
      var email = $("login-email").value;
      Auth.resetPassword(email).then(function (r) {
        if (!r.ok) { $("login-err").textContent = r.error; return; }
        $("login-err").textContent = "";
        cqInfo("📬 Sıfırlama linki gönderildi", email + " adresine şifre sıfırlama linki yolladık.");
      });
    });
  }
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.orig = btn.textContent; btn.textContent = label || "…"; btn.disabled = true; }
    else { btn.textContent = btn.dataset.orig || btn.textContent; btn.disabled = false; }
  }
  function switchAuthTab(which) {
    var login = which === "login";
    $("tab-login").classList.toggle("active", login);
    $("tab-register").classList.toggle("active", !login);
    $("form-login").classList.toggle("hidden", !login);
    $("form-register").classList.toggle("hidden", login);
  }
  function showAuth() { $("auth").classList.remove("hidden"); setTimeout(function () { $("login-email").focus(); }, 50); }
  function hideAuth() { $("auth").classList.add("hidden"); }

  let terminalBooted = false;
  let buttonsWired = false;

  function enterAppFromAuth() { hideAuth(); bootSession(); }

  /* =======================================================================
     OTURUM AÇILDIKTAN SONRA
     ======================================================================= */
  function bootSession() {
    player = Auth.getProfile();
    // güvenlik: eski/eksik profil alanlarını tamamla
    player.badges = player.badges || [];
    player.completed = player.completed || [];
    player.freeHints = player.freeHints || 0;
    player.story = player.story || [];
    if (typeof player.avatar !== "number") player.avatar = 0;
    save();
    wireButtonsOnce();
    updateHud();
    enterHome();
  }

  function wireButtonsOnce() {
    if (buttonsWired) return;
    buttonsWired = true;
    // profil sayfası
    $("btn-profile").onclick = openProfile;
    $("profile-close").onclick = closeProfile;
    $("btn-close-2").onclick = closeProfile;
    $("btn-logout").onclick = doLogout;
    $("hud-logout").onclick = function (e) { e.preventDefault(); doLogout(); };
    $("hud-home").onclick = function (e) { e.preventDefault(); backToHome(); };
    // avatar modal
    $("avatar-edit-btn").onclick = openAvatarModal;
    $("avatar-modal-close").onclick = closeAvatarModal;
    $("avatar-modal-done").onclick = closeAvatarModal;
    $("avatar-modal").addEventListener("click", function (e) { if (e.target === $("avatar-modal")) closeAvatarModal(); });
    // paylaşım kartı
    $("btn-share").onclick = openShareModal;
    $("share-close").onclick = closeShareModal;
    $("share-modal").addEventListener("click", function (e) { if (e.target === $("share-modal")) closeShareModal(); });
    $("share-download").onclick = function () {
      ShareCard.download(player).then(function () { cqToast("success", "Kart indirildi"); });
    };
    $("share-copy").onclick = function () {
      ShareCard.copy(player).then(function (ok) {
        cqToast(ok ? "success" : "info", ok ? "Panoya kopyalandı" : "Tarayıcın desteklemiyor — PNG indir");
      }).catch(function () { cqToast("info", "Kopyalanamadı — PNG indir"); });
    };
    // home
    $("guide-banner").onclick = openGuide;
    $("home-logout").onclick = doLogout;
    $("story-continue").onclick = function (e) { e.stopPropagation(); goToTerminal(); };
    $("story-card").onclick = function () { goToTerminal(); };
    $("lab-grid").addEventListener("click", function (e) {
      var card = e.target.closest(".lab-card");
      if (card) selectLab(card.getAttribute("data-id"));
    });
  }

  /* =======================================================================
     HOME / HUB
     ======================================================================= */
  function enterHome() {
    $("app").classList.add("hidden");
    $("profile-page").classList.add("hidden");
    renderHome();
    $("home").classList.remove("hidden");
    animateHome();
  }
  function backToHome() { updateHud(); enterHome(); }

  function renderHome() {
    $("home-avatar").innerHTML = avatarSVG(player.avatar, 60);
    $("home-uname").textContent = player.name;
    $("home-urank").textContent = player.rank;
    $("home-hero-name").textContent = player.name;

    var done = storyDone(), total = QUESTS.length;
    $("story-ring-pct").textContent = "%" + Math.round((done / total) * 100);
    $("story-continue").textContent = done === 0 ? "▶ Başla" : (done === total ? "✓ Tekrar Oyna" : "▶ Devam Et");

    $("story-chips").innerHTML = CHAPTERS.map(function (ch) {
      var qs = QUESTS.filter(function (q) { return q.chapter === ch.n; });
      var d = qs.filter(function (q) { return player.completed.indexOf(q.id) !== -1; }).length;
      var cls = (qs.length && d === qs.length) ? "chip-done" : (d > 0 ? "chip-part" : "chip-todo");
      return "<span class='ch-chip " + cls + "' title='Ch" + ch.n + " · " + esc(ch.title) + "'>" + ch.n + "</span>";
    }).join("");

    $("lab-grid").innerHTML = MODULES.map(function (m) {
      var soon = m.status !== "active";
      return "<button class='lab-card" + (soon ? " soon" : "") + "' data-id='" + m.id + "' type='button'>" +
               "<div class='lab-icon'>" + m.icon + "</div>" +
               "<div class='lab-title'>" + esc(m.title) + "</div>" +
               "<div class='lab-desc'>" + esc(m.desc) + "</div>" +
               "<div class='lab-tag'>" + (soon ? "🔒 yakında" : "✅ hazır") + "</div>" +
             "</button>";
    }).join("");
  }

  function animateHome() {
    if (typeof anime === "undefined") return;
    var done = storyDone(), total = QUESTS.length, pct = done / total, circ = 264;
    anime.set(["#home .home-hero", "#sec-story", "#sec-labs"], { opacity: 0, translateY: 18 });
    anime.set(".lab-card", { opacity: 0, translateY: 16, scale: 0.96 });
    anime.set("#story-ring-fill", { strokeDashoffset: circ });
    anime.timeline({ easing: "easeOutQuad" })
      .add({ targets: "#home .home-hero", opacity: 1, translateY: 0, duration: 420 })
      .add({ targets: "#sec-story", opacity: 1, translateY: 0, duration: 360 }, "-=220")
      .add({ targets: "#story-ring-fill", strokeDashoffset: circ * (1 - pct), duration: 900, easing: "easeInOutCubic" }, "-=180")
      .add({ targets: "#sec-labs", opacity: 1, translateY: 0, duration: 340 }, "-=760")
      .add({ targets: ".lab-card", opacity: 1, translateY: 0, scale: 1, duration: 420, delay: anime.stagger(70) }, "-=520");
  }

  function goToTerminal() {
    $("home").classList.add("hidden");
    $("app").classList.remove("hidden");
    mode = "menu"; refreshPrompt();
    updateHud();
    if (!terminalBooted) { terminalBoot(); terminalBooted = true; }
    inputEl.focus();
  }

  function selectLab(id) {
    var m = MODULES.find(function (x) { return x.id === id; });
    if (!m) return;
    if (m.status !== "active") { cqToast("info", m.icon + " " + m.title + " — yakında!"); return; }
    goToTerminal();
    submit("lab " + m.id);
  }

  /* =======================================================================
     SweetAlert2 — temalı dialog / toast yardımcıları
     (Swal yoksa native confirm / terminal print'e düşer.)
     ======================================================================= */
  var _cqSwal = null;
  function cqSwal() {
    if (typeof Swal === "undefined") return null;
    if (!_cqSwal) {
      _cqSwal = Swal.mixin({
        background: "#0c1524", color: "#c8d3e0", buttonsStyling: false,
        heightAuto: false,        // <html>/<body>'ye height:auto uygulamasın (tam-ekran düzende siyah şerit/kayma yapar)
        scrollbarPadding: false,  // scrollbar telafisi için body'ye padding eklemesin
        customClass: {
          popup: "cq-swal", title: "cq-swal-title", htmlContainer: "cq-swal-html",
          confirmButton: "cq-swal-confirm", cancelButton: "cq-swal-cancel"
        }
      });
    }
    return _cqSwal;
  }
  function cqToast(icon, title) {
    var s = cqSwal();
    if (!s) { print("   " + title, "hintline"); return; }
    s.fire({ toast: true, position: "bottom", timer: 2600, timerProgressBar: true,
             backdrop: false, showConfirmButton: false, icon: icon, title: title });
  }
  function cqInfo(title, html) {
    var s = cqSwal();
    if (!s) { alert(title + "\n\n" + String(html).replace(/<[^>]+>/g, "")); return Promise.resolve(); }
    return s.fire({ icon: "info", title: title, html: html, backdrop: "rgba(3, 6, 12, 0.72)",
                    confirmButtonText: "Tamam" });
  }
  function cqConfirm(opts) {
    var s = cqSwal();
    if (!s) {
      return Promise.resolve(typeof window.confirm === "function" ? window.confirm(opts.title) : true);
    }
    // Modalı bir sonraki tick'te aç: komutu gönderen Enter tuşu, yeni açılan
    // dialog'un odaklı düğmesini tetikleyip modalı anında kapatmasın.
    return new Promise(function (resolve) {
      setTimeout(function () {
        s.fire({
          icon: opts.icon || "warning", title: opts.title, html: opts.html,
          backdrop: "rgba(3, 6, 12, 0.72)",
          showCancelButton: true, focusCancel: true, reverseButtons: true,
          allowEnterKey: false,
          confirmButtonText: opts.confirmText || "Evet", cancelButtonText: opts.cancelText || "Vazgeç"
        }).then(function (r) { resolve(!!r.isConfirmed); });
      }, 0);
    });
  }

  /* =======================================================================
     LOADING EKRANI
     ======================================================================= */
  function runLoader(done) {
    var log = $("boot-log");
    var fill = $("loader-fill");
    var pctEl = $("loader-pct");
    var lines = [
      "[ BOOT ]  CloudQuest OS v4.8",
      "[  OK  ]  neural uplink established",
      "[  OK  ]  mounting /cloud volumes",
      "[  OK  ]  loading skill matrices",
      "[  OK  ]  calibrating XP core",
      "[ WARN ]  caffeine levels low ☕",
      "[  OK  ]  mentor 'Nova' online",
      "[  OK  ]  terminal ready"
    ];
    var i = 0, pct = 0;
    var step = function () {
      if (i < lines.length) {
        log.textContent += lines[i] + "\n";
        i++;
        pct = Math.min(100, Math.round((i / lines.length) * 100));
        fill.style.width = pct + "%";
        pctEl.textContent = pct + "%";
        setTimeout(step, 210 + Math.floor(i === 5 ? 260 : 0));
      } else {
        fill.style.width = "100%"; pctEl.textContent = "100%";
        setTimeout(function () {
          $("loader").classList.add("fade-out");
          setTimeout(function () { $("loader").classList.add("hidden"); done(); }, 480);
        }, 350);
      }
    };
    step();
  }

  /* =======================================================================
     BAŞLANGIÇ
     ======================================================================= */
  function init() {
    setupAuthScreen();
    // Sunucu oturumunu geri yükle (loader dönerken paralel çalışır).
    var ready = Auth.init();
    runLoader(function () {
      ready.then(function (r) {
        if (!r.ok && r.reason === "not-configured") { showSetupNeeded(); return; }
        if (!r.ok && r.reason === "sdk-missing")    { showSetupNeeded("Supabase SDK yüklenemedi (js/lib/supabase.min.js)."); return; }
        if (Auth.currentEmail()) bootSession();     // oturum açıksa doğrudan gir
        else {
          showAuth();
          if (!r.ok && r.reason === "network") {
            $("login-err").textContent = "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.";
          }
        }
      });
    });
  }

  // config.js doldurulmamışsa oyunu açmak yerine net bir kurulum ekranı göster.
  function showSetupNeeded(extra) {
    $("loader").classList.add("hidden");
    $("auth").classList.remove("hidden");
    $("form-login").classList.add("hidden");
    $("form-register").classList.add("hidden");
    document.querySelector(".auth-tabs").classList.add("hidden");
    var box = document.createElement("div");
    box.className = "auth-setup";
    box.innerHTML =
      "<p><b>Sunucu yapılandırılmamış.</b></p>" +
      "<p>Gerçek hesaplar için Supabase bağlantısı gerekiyor:</p>" +
      "<ol><li><code>web/js/config.js</code> dosyasını aç</li>" +
      "<li>Supabase panelindeki <b>Project URL</b> ve <b>anon key</b> değerlerini yapıştır</li>" +
      "<li>Sayfayı yenile</li></ol>" +
      (extra ? "<p class='setup-extra'>" + esc(extra) + "</p>" : "") +
      "<p class='setup-extra'>Ayrıntı: <code>docs/SETUP-SUPABASE.md</code></p>";
    document.querySelector(".auth-card").appendChild(box);
  }

  init();
})();
