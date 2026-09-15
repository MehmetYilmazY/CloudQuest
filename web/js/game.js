/* =========================================================================
   CloudQuest — Oyun motoru + ekran orkestrasyonu
   Akış: LOADER -> AUTH (giriş/kayıt) -> APP (terminal) <-> PROFİL
   Bağımlılıklar: content.js (CHAPTERS/QUESTS/SHOP), avatars.js (AVATARS/avatarSVG),
   auth.js (Auth). Kayıt: aktif hesabın profilinde (Auth).
   ========================================================================= */

(function () {
  "use strict";

  /* Cevirilere kisayol: bu dosyada yuzlerce yerde geciyor.
     Anahtarlar data/i18n/ui.*.json icinde. */
  const T = I18N.t;

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
  let questAttempts = [];            // quest boyunca biriken denemeler (bitiste toplu gonderilir)
  const history = []; let histPos = -1;

  /* ---------------- Rank & XP (SADECE GÖSTERİM) ----------------
     Bu iki fonksiyon HUD'daki çubuğu ve profil sayfasını çizmek için var.
     Bağlayıcı hesap shared/progression.ts içinde ve SUNUCUDA çalışıyor;
     burada bir sayı değiştirmek kaydı değiştirmez. Denge değişirse iki
     yeri birden güncelle (Katman 2'de tek TS modülüne inecek). */
  function rankFor(level) {
    if (level >= 12) return T("rank.wizard");
    if (level >= 10) return T("rank.architect");
    if (level >= 8)  return T("rank.senior");
    if (level >= 5)  return T("rank.engineer");
    if (level >= 3)  return T("rank.junior");
    if (level >= 2)  return T("rank.associate");
    return T("rank.intern");
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
  // Anlatı satırlarında daktilo efekti (metin DOM'a tam yazılır, görsel olarak akar)
  const TYPED = { mentor: 1, story: 1, task: 1, teach: 1, ok: 1 };
  function print(text, cls) {
    const line = document.createElement("div");
    line.className = "line" + (cls ? " " + cls : "");
    line.textContent = text == null ? "" : text;
    screenEl.appendChild(line);
    if (cls && TYPED[cls] && typeof FX !== "undefined") FX.typewrite(line);
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
    if (typeof FX !== "undefined") FX.countUp(hud.credits, player.credits, { suffix: " 💠" });
    else hud.credits.textContent = player.credits + " 💠";
    hud.quests.textContent = storyDone() + " / " + QUESTS.length;
    hud.badges.textContent = player.badges.length ? player.badges.join(", ") : "—";
    const acc = Auth.accountInfo();
    hud.account.textContent = acc ? acc.email : "—";
  }

  /* KATMAN 1: ödül hesabı artık burada YAPILMAZ.
     Sunucu (game Edge Function) XP/level/credits'i hesaplar ve yazar; bu
     fonksiyonlar yalnızca gelen sonucu ekrana döker. Yerelde bir sayı
     uydurmak HUD'u anlık yanıltır ama kaydı değiştirmez — bu yüzden hiç
     uydurmuyoruz: `progress` sunucunun döndürdüğü hakikattir. */
  function showAward(award, progress) {
    if (!award) return;
    if (award.xp)      print("   +" + award.xp + " XP", "xp");
    if (award.credits) print(T("term.awardcredits", { n: award.credits }), "credit");

    if (progress) Auth.applyServerProgress(progress);

    if (award.leveledUp) {
      blank();
      print(T("term.levelup", { level: player.level }), "levelup");
      print(T("term.newrank", { rank: player.rank }), "levelup");
      blank();
      if (typeof FX !== "undefined") FX.levelUp(player.level, player.rank);
    }
    if (award.badge) print(T("term.newbadge", { badge: award.badge }), "levelup");
    updateHud();
  }

  /** Sunucu hatalarını tek yerden, kullanıcının anlayacağı dille bas. */
  function serverError(e, what) {
    print("   ⚠ " + (what || T("err.generic")) + ": " + (e && e.message ? e.message : e), "err");
    print(T("err.serverhint"), "muted");
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

  /* ---------------- Sahne paneli (sağdaki görsel kutu) ---------------- */
  function chapterStats() {
    return CHAPTERS.map(function (ch) {
      var qs = QUESTS.filter(function (q) { return q.chapter === ch.n; });
      return {
        n: ch.n, title: ch.title, total: qs.length,
        done: qs.filter(function (q) { return player.completed.indexOf(q.id) !== -1; }).length
      };
    });
  }
  function sceneHub()        { if (typeof CQScene !== "undefined") CQScene.hub(chapterStats()); }
  function sceneQuest(q)     { if (typeof CQScene !== "undefined") CQScene.quest(q); }
  function sceneStep(i, t, k){ if (typeof CQScene !== "undefined") CQScene.step(i, t, k); }
  function sceneApply(cmd, quiet) { if (typeof CQScene !== "undefined") CQScene.apply(cmd, quiet); }

  /* ---------------- Menü komutları ---------------- */
  function showHelp() {
    rule(); print(T("help.title"), "title"); blank();
    [
      ["quests", "help.quests"],
      ["quest <id>", "help.quest"],
      ["map", "help.map"],
      ["home", "help.home"],
      ["guide", "help.guide"],
      ["labs", "help.labs"],
      ["lab <id>", "help.lab"],
      ["status  (me)", "help.status"],
      ["profile", "help.profile"],
      ["shop", "help.shop"],
      ["buy <n>", "help.buy"],
      ["roadmap", "help.roadmap"],
      ["clear", "help.clear"],
      ["reset", "help.reset"],
      ["logout", "help.logout"],
      ["help  (?)", "help.help"]
    ].forEach(function (r) { print("   " + pad(r[0], 16) + T(r[1]), "help-row"); });
    blank();
    print(T("help.inquest", { cost: ANSWER_COST }), "muted");
    rule();
  }

  function showQuests() {
    rule(); print(T("quests.title"), "title"); blank();
    QUESTS.forEach(function (q) {
      var st = questStatus(q);
      if (st === "done") print("   ✅ [" + q.id + "] " + q.title + "  (ch" + q.chapter + ")", "muted");
      else if (st === "available") print("   ▶  [" + q.id + "] " + q.title + "  (ch" + q.chapter + ")  +" + q.xp + " XP", "avail");
      else print("   🔒 [" + q.id + "] " + q.title + "  (" + T("common.first") + " " + q.requires.join(", ") + ")", "locked");
    });
    blank(); print(T("quests.howto", { id: firstAvailableId() }), "hintline"); rule();
  }

  function showMap() {
    rule(); print(T("map.title"), "title"); blank();
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
    print(T("map.upcoming"), "hintline");
    MODULES.forEach(function (m) {
      var tag = m.status === "active" ? "✅" : "🔒";
      print("   " + tag + "  " + m.icon + " " + pad(m.title, 22) + "[" + m.id + "]", "locked");
    });
    print(T("map.detail"), "muted");
    rule();
  }

  function showLabs() {
    rule(); print(T("labs.title"), "title"); blank();
    print(T("labs.intro1"), "mentor");
    print(T("labs.intro2"), "muted"); blank();
    MODULES.forEach(function (m) {
      var tag = m.status === "active" ? T("tag.ready") : T("tag.soon");
      print("   " + m.icon + "  " + pad("[" + m.id + "]", 13) + pad(m.title, 20) + tag, m.status === "active" ? "avail" : "locked");
      print("        " + m.desc, "muted");
    });
    blank();
    print(T("labs.howto"), "hintline"); rule();
  }
  function showLab(id) {
    var m = MODULES.find(function (x) { return x.id === (id || "").toLowerCase(); });
    if (!m) { print(T("lab.notfound", { id: id }), "err"); return; }
    rule(); print("   " + m.icon + "  " + T("lab.module") + " " + m.title + "   [" + m.id + "]", "questhead");
    print("   " + m.desc, "teach"); blank();
    if (m.status === "active" && m.quests && m.quests.length) {
      blank(); print(T("lab.tasks"), "title");
      m.quests.forEach(function (q) {
        var st = questStatus(q);
        if (st === "done") print("   ✅ [" + q.id + "] " + q.title, "muted");
        else if (st === "available") print("   ▶  [" + q.id + "] " + q.title + "   +" + q.xp + " XP", "avail");
        else print("   🔒 [" + q.id + "] " + q.title + "   (" + T("common.first") + " " + q.requires.join(", ") + ")", "locked");
      });
      var nxt = m.quests.filter(function (q) { return questStatus(q) === "available"; })[0];
      blank();
      if (nxt) print(T("lab.start", { id: nxt.id }), "hintline");
      else print(T("lab.done"), "levelup");
    } else {
      print(T("lab.topics"), "muted");
      m.topics.forEach(function (t) { print("     • " + t, "help-row"); });
      blank();
      print(T("lab.inactive"), "locked");
      print(T("lab.novanote"), "mentor");
    }
    rule();
  }

  function showStatus() {
    rule(); print("   👤 " + player.name, "title");
    print("   " + pad(T("status.rank"), 8) + ": " + player.rank, "cyan");
    print("   " + pad(T("status.level"), 8) + ": " + player.level + "   XP: " + player.xp + "/" + xpToNext(player.level), "xp");
    print("   " + pad(T("status.credits"), 8) + ": " + player.credits + " 💠", "cyan");
    print("   " + pad(T("status.badges"), 8) + ": " + (player.badges.length ? player.badges.join(", ") : T("status.nobadge")), "credit");
    print("   " + pad(T("status.quests"), 8) + ": " + T("status.questcount", { done: storyDone(), total: QUESTS.length }), "muted");
    print(T("status.more"), "hintline");
    rule();
  }

  function showShop() {
    rule(); print(T("shop.title"), "title");
    print(T("shop.balance", { n: player.credits }), "cyan"); blank();
    SHOP.forEach(function (item) {
      print("   " + item.id + ") " + item.icon + "  " + pad(item.name, 22) + item.cost + " 💠  — " + item.desc, "avail");
    });
    blank(); print(T("shop.howto"), "hintline"); rule();
  }
  function buy(nRaw) {
    var n = parseInt(nRaw, 10);
    var item = SHOP.find(function (i) { return i.id === n; });
    if (!item) { print(T("shop.badpick"), "err"); return; }
    // Aşağıdaki iki kontrol sadece hızlı geri bildirim için; bağlayıcı olan
    // sunucudaki kontrol (fiyatı ve etkiyi de sunucu okur).
    if (player.credits < item.cost) { print(T("shop.nocredit", { n: item.cost }), "err"); return; }
    if (item.effect.badge && player.badges.indexOf(item.effect.badge) !== -1) { print(T("shop.owned"), "hintline"); return; }

    CQApi.purchase(item.id).then(function (res) {
      print(T("shop.bought", { name: item.name }), "credit");
      showAward(res.award, res.progress);
      if (item.effect.freeHints) print(T("shop.freehints", { n: item.effect.freeHints }), "hintline");
      updateHud();
    }).catch(function (e) {
      if (e.status === 402) { print(T("shop.nocredit2"), "err"); return; }
      if (e.status === 409) { print(T("shop.owned"), "hintline"); return; }
      serverError(e, T("err.purchase"));
    });
  }

  function showRoadmap() {
    rule(); print(T("roadmap.title"), "title"); blank();
    [1, 2, 3, 4, 5, 6].forEach(function (n) {
      print("   " + pad(T("roadmap.m" + n + ".label"), 8) + T("roadmap.m" + n + ".text"), "help-row");
    });
    blank();
    print(T("roadmap.loop"), "hintline");
    print(T("roadmap.ratio"), "mentor");
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
    if (!q) { print(T("quest.notfound", { id: id }), "err"); return; }
    var st = questStatus(q);
    if (st === "done")   { print(T("quest.alreadydone"), "hintline"); return; }
    if (st === "locked") { print(T("quest.locked", { list: q.requires.join(", ") }), "err"); return; }

    /* Quest anında açılır: adım takibi tarayıcıda. Sunucuya yalnızca
       quest bittiğinde tek bir istek gider (ödül için). */
    beginQuestUi(q, 0);
  }

  function beginQuestUi(q, startIndex) {
    activeQuest = q; objIndex = startIndex || 0; wrongCount = 0; questAttempts = [];
    mode = "quest"; refreshPrompt();
    sceneQuest(q);                       // sağdaki sahneyi bu questin dünyasına kur
    clearScreen(); rule();
    print("   ▶ " + T("quest.label") + " " + q.title + "   [" + q.id + "]", "questhead"); rule();
    var track = trackOfChapter(q.chapter);
    if (track && trackQuests(track)[0].id === q.id) showActIntro(track);   // perde açılışı
    showQuestBeat(q.id, "intro");
    narrate(q.brief, "mentor"); blank();
    print(T("quest.keys", { cost: ANSWER_COST }), "muted"); blank();
    showObjective();
  }
  function showObjective() {
    var obj = activeQuest.objectives[objIndex];
    sceneStep(objIndex, activeQuest.objectives.length, obj.task);
    print("   ── " + T("quest.step", { n: objIndex + 1, total: activeQuest.objectives.length }) + " " + "─".repeat(28), "objhead");
    print("   🎯 " + obj.task, "task");
    print("   💡 " + obj.teach, "teach");
  }
  /* Komut kontrolü TARAYICIDA, anında. Terminalin en iyi yanı gecikmesiz
     olması; her komutta sunucuya gidip 200ms beklemek o hissi öldürüyordu.

     Bunun bedeli: `expect` spec'leri bundle'da, yani kararlı biri cevapları
     okuyabilir. Kabul edilen bir takas (bkz. docs/LAYER-1-SERVER-AUTHORITY).
     Ödül hâlâ sunucudan geliyor — quest bitince tek istek. */
  function handleQuestInput(cmd) {
    var lower = cmd.toLowerCase();
    if (/^(abandon|exit|back|quit|çık|cik)$/.test(lower)) { print(T("quest.abandoned"), "hintline"); backToMenu(); return; }
    if (/^(hint|ipucu)$/.test(lower)) { revealHint(); return; }
    if (/^(task|görev|gorev|look)$/.test(lower)) { print("   🎯 " + activeQuest.objectives[objIndex].task, "task"); return; }
    if (/^(lang|dil)$/.test(lower)) { I18N.setLang(I18N.lang === "tr" ? "en" : "tr"); return; }
    if (cmd.trim() === "") return;

    var obj = activeQuest.objectives[objIndex];
    var ok = CQParser.match(cmd, obj.expect);

    /* Telemetri: her deneme quest boyunca biriktirilip bitişte TEK istekle
       gönderiliyor. Ayrı istek atmadığımız için maliyeti sıfır, ama
       "oyuncular hangi adımda takılıyor" verisi korunuyor. */
    if (questAttempts.length < 200) {
      questAttempts.push({ objIndex: objIndex, command: cmd.slice(0, 500), ok: ok });
    }

    if (ok) onCorrect(cmd, obj);
    else onWrong();
  }

  function onCorrect(cmd, obj) {
    sceneApply(cmd);                      // doğru komut: sahnede sonucunu göster
    print("   ✔ " + obj.success, "ok");
    wrongCount = 0; objIndex++;
    if (objIndex >= activeQuest.objectives.length) finishQuest();
    else { blank(); showObjective(); }
  }

  function onWrong() {
    wrongCount++;
    if (wrongCount >= MAX_WRONG_BEFORE_ANSWER) {
      // Güvenlik ağı: cevabı ücretsiz göster. Metin bundle'da olmadığı için
      // sunucudan çekiliyor — nadir bir çağrı, gecikmesi hissedilmiyor.
      print(T("wrong.safetynet"), "err");
      wrongCount = 0;
      fetchHint(activeQuest, objIndex, true, function (hint) {
        print(T("hint.type", { hint: hint }), "hintline");
      });
      return;
    }
    print(T("wrong.retry", { left: MAX_WRONG_BEFORE_ANSWER - wrongCount }), "err");
  }

  /* İpucu metnini sunucudan çeker. `free` true ise bedel alınmaz
     (3 yanlış sonrası güvenlik ağı); false ise sunucu krediden düşer. */
  function fetchHint(quest, step, free, onGot) {
    CQApi.hint(quest.id, step, free).then(function (res) {
      if (mode !== "quest" || activeQuest !== quest) return;
      if (res.paidWith === "free") {
        Auth.applyServerProgress({ freeHints: res.freeHints });
        print(T("hint.usedfree", { left: res.freeHints }), "hintline");
      } else if (res.paidWith === "credits") {
        Auth.applyServerProgress({ credits: res.credits });
        print(T("hint.paid", { cost: ANSWER_COST, left: res.credits }), "credit");
      }
      updateHud();
      onGot(res.hint);
    }).catch(function (e) {
      if (e.status === 402) { print(T("shop.nocredit2"), "err"); return; }
      serverError(e, T("err.hint"));
    });
  }
  /** Elle istenen ipucu: ücreti sunucu tahsil eder, cevabı sunucu verir. */
  function revealHint() {
    payForAnswer(function (hint) {
      print(T("hint.type", { hint: hint }), "hintline");
    });
  }

  function finishQuest() {
    var q = activeQuest;
    blank(); rule(); narrate(q.complete, "mentor"); blank();
    if (typeof FX !== "undefined") FX.burstCenter({ count: 30 });   // quest tamamlandı kutlaması
    showQuestBeat(q.id, "complete");

    /* Ödülü sunucu verir — quest başına TEK istek. İstemci kendi XP'sini
       yazamaz (profiles'ta kolon bazlı GRANT duruyor), o yüzden konsoldan
       "level 99" hâlâ mümkün değil. */
    CQApi.complete(q.id, questAttempts).then(function (res) {
      if (res.alreadyCompleted) return;
      showAward(res.award, res.progress);
    }).catch(function (e) {
      serverError(e, T("err.award"));
      print(T("err.awardhint"), "hintline");
    });
    rule();
    var track = trackOfChapter(q.chapter);
    if (track && trackQuests(track).slice(-1)[0].id === q.id) showActOutro(track);   // perde kapanışı
    if (isLabQuest(q)) {
      var mod = moduleOfQuest(q.id);
      var nextLab = mod && mod.quests.filter(function (x) { return questStatus(x) === "available"; })[0];
      if (nextLab) print(T("quest.next", { id: nextLab.id }), "hintline");
      else print(T("lab.finished", { name: mod ? mod.icon + " " + mod.title : "Lab" }), "levelup");
    } else if (storyDone() === QUESTS.length) {
      blank(); print(T("quest.allDone"), "levelup");
    } else {
      print(T("quest.next", { id: firstAvailableId() }), "hintline");
    }
    backToMenu();
  }
  function backToMenu() {
    activeQuest = null; objIndex = 0; wrongCount = 0; mode = "menu"; refreshPrompt();
    sceneHub();
  }

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
    print(T("banner.langtip"), "muted");
    rule();
  }
  function terminalBoot() {
    clearScreen(); showBanner();
    var isNew = player.completed.length === 0 && player.level === 1 && player.xp === 0;
    print(T("boot.welcome", { name: player.name, rank: player.rank }), "ok");
    blank();
    if (isNew) {
      if (STORY && STORY.prologue) showStoryBeat("prologue", STORY.startup + T("boot.prologue"), STORY.prologue);
      narrate([T("boot.tip1"), T("boot.tip2")], "mentor");
      blank(); print(T("boot.helptip"), "hintline");
    } else {
      print(T("boot.resume", { done: storyDone(), total: QUESTS.length }), "muted");
      if (storyDone() < QUESTS.length) print(T("quest.next", { id: firstAvailableId() }), "hintline");
      else print(T("boot.alldone"), "levelup");
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
        if (arg) startQuest(arg.toLowerCase()); else print(T("usage.quest"), "hintline"); break;
      case "map": showMap(); break;
      case "home": case "anasayfa": backToHome(); break;
      case "guide": case "rehber": openGuide(); break;
      case "labs": case "modules": showLabs(); break;
      case "lab": case "module":
        if (arg) showLab(arg); else print(T("usage.lab"), "hintline"); break;
      case "status": case "me": showStatus(); break;
      case "profile": openProfile(); break;
      case "shop": showShop(); break;
      case "buy": buy(arg); break;
      case "roadmap": showRoadmap(); break;
      case "clear": case "cls": clearScreen(); showBanner(); break;
      case "reset": doReset(); break;
      case "logout": case "signout": doLogout(); break;
      case "lang": case "dil": I18N.setLang(arg ? arg.toLowerCase() : (I18N.lang === "tr" ? "en" : "tr")); break;
      default: print(T("cmd.unknown", { verb: verb }), "err");
    }
  }

  /* ---------------- Girdi olayları ---------------- */
  function submit(raw) {
    echoCommand(raw);
    if (raw.trim() !== "") { history.push(raw); if (history.length > 100) history.shift(); }
    histPos = history.length;
    if (mode === "quest") handleQuestInput(raw);
    else { handleMenuInput(raw); sceneApply(raw, true); }
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
  /* Cevabı açmak bedava değil. Onay ekranı burada, TAHSİLAT sunucuda:
     istemci "ödedim" diyemez, ipucunu ancak sunucu bedeli düştükten sonra
     döndürür. Bakiye kontrolü de sunucuda tekrar yapılır. */
  function payForAnswer(onGranted) {
    var quest = activeQuest;
    var step = objIndex;
    var useFree = player.freeHints > 0;

    if (!useFree && player.credits < ANSWER_COST) {
      print(T("answer.nocredit", { cost: ANSWER_COST, balance: player.credits }), "err");
      print(T("answer.freeway"), "hintline");
      return;
    }

    cqConfirm({
      icon: "question",
      title: T("answer.confirmTitle"),
      html: useFree
        ? T("answer.confirmFree", { left: player.freeHints })
        : T("answer.confirmPaid", { cost: ANSWER_COST, balance: player.credits }),
      confirmText: useFree ? T("answer.useFree") : T("answer.payBtn", { cost: ANSWER_COST }),
      cancelText: T("answer.cancelBtn")
    }).then(function (ok) {
      inputEl.focus();
      if (!ok) return;
      // Onay beklenirken oyuncu ilerlemiş olabilir; hâlâ aynı adımda mıyız?
      if (mode !== "quest" || activeQuest !== quest || objIndex !== step) return;
      fetchHint(quest, step, false, onGranted);   // bedeli sunucu tahsil eder
    });
  }
  // Tab: cevabı doğrudan giriş kutusuna yazar.
  function requestAnswer() { payForAnswer(function (hint) { inputEl.value = hint; }); }
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
      [T("status.level"), player.level],
      ["XP", player.xp + "/" + xpToNext(player.level)],
      [T("status.credits"), player.credits + " 💠"],
      [T("status.quests"), done + " / " + total],
      [T("profile.badgeCount"), player.badges.length]
    ];
    $("profile-stats").innerHTML = stats.map(function (s) {
      return "<div class='stat-tile'><div class='stat-val'>" + s[1] + "</div><div class='stat-key'>" + s[0] + "</div></div>";
    }).join("");

    var readyPct = Math.round((done / total) * 100);
    $("ready-fill").style.width = readyPct + "%";
    $("ready-text").textContent = T("common.pct", { n: readyPct }) + (readyPct === 100 ? T("profile.jobReady") : "");

    $("badge-grid").innerHTML = player.badges.length
      ? player.badges.map(function (b) { return "<span class='badge-chip'>" + esc(b) + "</span>"; }).join("")
      : "<span class='muted-inline'>" + T("profile.noBadges") + "</span>";

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
               "<span class='mod-chip-pct'>" + (s.complete ? "✓" : T("common.pct", { n: s.pct })) + "</span>" +
             "</span>";
    }).join("");

    // Şu anki modülün eğitimleri + yüzdesi
    $("cur-module-name").textContent = cur.tr.title;
    $("cur-module-pct").textContent = T("common.pct", { n: cur.pct }) + " (" + cur.done + "/" + cur.total + ")";
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
        // Rozet ve XP'yi sunucu verir; istemci sadece "rehberi bitirdim" der.
        if (player.badges.indexOf(badge) !== -1) return;
        CQApi.milestone("guide").then(function (res) {
          if (res.alreadyOwned) return;
          showAward(res.award, res.progress);
          cqToast("success", T("toast.badgeEarned", { badge: badge }));
        }).catch(function (e) { serverError(e, T("err.badge")); });
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
    box.innerHTML = "<div class='share-loading'>" + T("share.building") + "</div>";
    $("share-modal").classList.remove("hidden");
    ShareCard.build(player).then(function (cv) {
      box.innerHTML = "";
      cv.classList.add("share-canvas");
      box.appendChild(cv);
    }).catch(function (e) {
      box.innerHTML = "<div class='share-loading'>" + T("share.failed") + " " + esc(e.message || e) + "</div>";
    });
  }
  function closeShareModal() { $("share-modal").classList.add("hidden"); }

  function doLogout() {
    cqConfirm({
      icon: "question", title: T("logout.title"),
      html: T("logout.body"),
      confirmText: T("logout.confirm"), cancelText: T("logout.cancel")
    }).then(function (ok) {
      if (!ok) return;
      save();
      // Bekleyen yazmalar buluta gitsin, sonra oturumu kapat.
      Auth.logout().then(function () {
        cqToast("success", T("toast.loggedOut"));
        setTimeout(function () { location.reload(); }, 650);
      });
    });
  }

  function doReset() {
    cqConfirm({
      icon: "warning", title: T("reset.title"),
      html: T("reset.body"),
      confirmText: T("reset.confirm"), cancelText: T("reset.cancel")
    }).then(function (ok) {
      if (!ok) { print(T("reset.cancelled"), "hintline"); return; }
      // Sıfırlama da sunucuda: reset_progress() hem profili hem quest_progress'i temizler.
      CQApi.reset().then(function (res) {
        Auth.applyServerProgress(res.progress);
        player.story = [];                  // sinematikler kozmetik; istemci yazabilir
        save(); updateHud();
        terminalBooted = false;             // terminale dönünce welcome yeniden gösterilsin
        print(T("reset.done"), "levelup");
        cqToast("success", T("toast.resetOk"));
        backToHome();
      }).catch(function (e) {
        serverError(e, T("err.reset"));
        cqToast("error", T("toast.resetFail"));
      });
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
      clearRejected("form-login");
      $("login-err").textContent = "";
      var btn = $("form-login").querySelector("button[type=submit]");
      var email = $("login-email").value, pass = $("login-pass").value;
      busy(btn, true, T("auth.connecting"));
      Auth.login(email, pass).then(function (r) {
        busy(btn, false);
        if (!r.ok) {
          $("login-err").textContent = r.error;
          stamp(r.code, "form-login");
          return;
        }
        stampOk(enterAppFromAuth);
      });
    });

    $("form-register").addEventListener("submit", function (e) {
      e.preventDefault();
      clearRejected("form-register");
      $("reg-err").textContent = "";
      var btn = $("form-register").querySelector("button[type=submit]");
      var name = $("reg-name").value.trim() || "engineer";
      var email = $("reg-email").value, pass = $("reg-pass").value;
      var profile = newProfile(name, regAvatar);
      busy(btn, true, T("auth.creating"));
      Auth.register({ email: email, password: pass, profile: profile }).then(function (r) {
        busy(btn, false);
        if (r.ok) { stampOk(enterAppFromAuth); return; }
        if (r.needsConfirmation) {         // e-posta doğrulaması bekleniyor
          $("reg-err").textContent = "";
          cqInfo(T("auth.verifyEmail"), r.error);
          switchAuthTab("login");
          $("login-email").value = email;
          return;
        }
        $("reg-err").textContent = r.error;
        stamp(r.code, "form-register");
      });
    });

    // Şifremi unuttum
    $("forgot-link").addEventListener("click", function (e) {
      e.preventDefault();
      var email = $("login-email").value;
      Auth.resetPassword(email).then(function (r) {
        if (!r.ok) { $("login-err").textContent = r.error; stamp(r.code, "form-login"); return; }
        $("login-err").textContent = "";
        cqInfo(T("auth.resetSentTitle"), T("auth.resetSentBody", { email: email }));
      });
    });

    /* Kullanıcı tekrar yazmaya başlayınca kırmızı çerçeve ve hata temizlensin —
       hata mesajının ekranda çakılı kalması cezalandırıcı hissettiriyor. */
    ["login-email", "login-pass", "reg-email", "reg-pass", "reg-name"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", function () {
        var form = el.closest("form");
        if (form) form.classList.remove("rejected");
        var errBox = form && form.querySelector(".auth-err");
        if (errBox) errBox.textContent = "";
      });
    });
  }

  /* =======================================================================
     GİRİŞ DAMGASI
     -----------------------------------------------------------------------
     Hata mesajı küçük gri bir satır olarak kaybolmasın: reddedilen bir evrak
     gibi damgalansın. Damganın metni hatanın TÜRÜNE göre değişir — kullanıcı
     "yanlış şifre" ile "sunucuya ulaşılamıyor" arasındaki farkı bir bakışta
     görsün, çünkü ikisinin çözümü tamamen farklı.
     ======================================================================= */
  var STAMPS = {
    credentials:     "ACCESS DENIED",
    network:         "CONNECTION FAILED",
    config:          "NO ENDPOINT",
    unconfirmed:     "UNVERIFIED",
    duplicate:       "DUPLICATE ENTRY",
    ratelimit:       "RATE LIMITED",
    "weak-password": "TOO WEAK",
    "bad-email":     "MALFORMED",
    unknown:         "REJECTED"
  };

  function stamp(code, formId) {
    var el = $("auth-stamp"), card = $("auth-card"), txt = $("auth-stamp-text");
    if (!el || !txt) return;

    txt.textContent = STAMPS[code] || STAMPS.unknown;
    el.classList.remove("ok");

    // Bağlantı koptuysa başlıktaki "secure channel" göstergesi de kızarsın.
    var net = $("auth-head-net");
    if (net) {
      var down = code === "network" || code === "config";
      net.classList.toggle("down", down);
      net.textContent = down ? "no signal" : "secure channel";
    }

    if (formId) $(formId).classList.add("rejected");

    // Animasyonu yeniden tetiklemek için sınıfı düşürüp reflow zorluyoruz;
    // yoksa arka arkaya hatalarda damga ikinci kez oynamaz.
    el.classList.remove("hit");
    if (card) { card.classList.remove("shake", "flash"); }
    void el.offsetWidth;
    el.classList.add("hit");
    if (card) {
      card.classList.add("shake", "flash");
      setTimeout(function () { card.classList.remove("shake"); }, 420);
      setTimeout(function () { card.classList.remove("flash"); }, 1400);
    }
  }

  /** Başarıda aynı mekanik, yeşil: kapı açıldı hissi. */
  function stampOk(then) {
    var el = $("auth-stamp"), txt = $("auth-stamp-text");
    if (!el || !txt) { then(); return; }
    txt.textContent = "ACCESS GRANTED";
    el.classList.add("ok");
    el.classList.remove("hit");
    void el.offsetWidth;
    el.classList.add("hit");
    setTimeout(then, 620);
  }

  function clearRejected(formId) {
    var f = $(formId);
    if (f) f.classList.remove("rejected");
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
    $("tab-login").setAttribute("aria-selected", String(login));
    $("tab-register").setAttribute("aria-selected", String(!login));
    $("form-login").classList.toggle("hidden", !login);
    $("form-register").classList.toggle("hidden", login);
    var mode = $("auth-head-mode");
    if (mode) mode.textContent = login ? "login" : "register";   // başlık nerede olduğunu söyler
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
      ShareCard.download(player).then(function () { cqToast("success", T("toast.cardSaved")); });
    };
    $("share-copy").onclick = function () {
      ShareCard.copy(player).then(function (ok) {
        cqToast(ok ? "success" : "info", ok ? T("toast.copied") : T("toast.copyUnsupported"));
      }).catch(function () { cqToast("info", T("toast.copyFailed")); });
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
    // sahne paneli: kur, tercihi hatırla, term-bar'daki düğmeyle aç/kapat
    if (typeof CQScene !== "undefined") {
      CQScene.mount($("scene"));
      try { if (localStorage.getItem("cq.scene") === "off") document.body.classList.add("scene-off"); }
      catch (e) { /* localStorage kapalıysa panel açık kalsın */ }
      $("scene-toggle").onclick = function () {
        var off = document.body.classList.toggle("scene-off");
        try { localStorage.setItem("cq.scene", off ? "off" : "on"); } catch (e) {}
        inputEl.focus();
      };
      sceneHub();
    }
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
    if (typeof FX !== "undefined") { FX.autoWire($("home")); FX.magnetic($("story-continue"), .18); }
  }
  function backToHome() { updateHud(); enterHome(); }

  function renderHome() {
    $("home-avatar").innerHTML = avatarSVG(player.avatar, 60);
    $("home-uname").textContent = player.name;
    $("home-urank").textContent = player.rank;
    $("home-hero-name").textContent = player.name;

    var done = storyDone(), total = QUESTS.length;
    $("story-ring-pct").textContent = T("common.pct", { n: Math.round((done / total) * 100) });
    $("story-continue").textContent = done === 0 ? T("home.start") : (done === total ? T("home.replay") : T("home.continue"));

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
               "<div class='lab-tag'>" + (soon ? T("tag.soon") : T("tag.ready")) + "</div>" +
             "</button>";
    }).join("");
  }

  // Ana sayfa açılış animasyonu. Animasyon rAF'a bağlıdır; sekme arka plandaysa
  // hiç çalışmaz. O yüzden hem reduced-motion'da hiç gizlemiyoruz hem de her
  // durumda son hâli garantileyen bir emniyet zamanlayıcısı bırakıyoruz.
  function homeFinalState() {
    if (typeof anime === "undefined") return;
    var done = storyDone(), total = QUESTS.length, circ = 264;
    anime.set(["#home .home-hero", "#sec-story", "#sec-labs", ".lab-card"],
              { opacity: 1, translateY: 0, scale: 1 });
    anime.set("#story-ring-fill", { strokeDashoffset: circ * (1 - done / total) });
  }
  function animateHome() {
    if (typeof anime === "undefined") return;
    if (typeof FX !== "undefined" && FX.reduce) { homeFinalState(); return; }
    var done = storyDone(), total = QUESTS.length, pct = done / total, circ = 264;
    setTimeout(homeFinalState, 2600);      // emniyet: animasyon koşmasa da içerik görünür
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
    var swap = function () {
      $("home").classList.add("hidden");
      $("app").classList.remove("hidden");
      mode = "menu"; refreshPrompt();
      updateHud(); sceneHub();
      if (!terminalBooted) { terminalBoot(); terminalBooted = true; }
      inputEl.focus();
    };
    if (typeof FX !== "undefined") FX.screenSwap(swap); else swap();
  }

  function selectLab(id) {
    var m = MODULES.find(function (x) { return x.id === id; });
    if (!m) return;
    if (m.status !== "active") { cqToast("info", T("toast.labSoon", { name: m.icon + " " + m.title })); return; }
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
                    confirmButtonText: T("dlg.ok") });
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
          confirmButtonText: opts.confirmText || T("dlg.yes"), cancelButtonText: opts.cancelText || T("dlg.cancel")
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
        if (!r.ok && r.reason === "sdk-missing")    { showSetupNeeded(T("setup.sdkMissing")); return; }
        if (Auth.currentEmail()) bootSession();     // oturum açıksa doğrudan gir
        else {
          showAuth();
          if (!r.ok && r.reason === "network") {
            $("login-err").textContent = T("auth.noServer");
            // Açılışta bağlantı yoksa damga hemen değil, kart oturduktan sonra insin.
            setTimeout(function () { stamp("network"); }, 420);
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
      T("setup.body") +
      (extra ? "<p class='setup-extra'>" + esc(extra) + "</p>" : "") +
      T("setup.more");
    document.querySelector(".auth-card").appendChild(box);
  }

  init();
})();
