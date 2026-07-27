<#
    CloudQuest  —  Cloud Engineering'i oynayarak öğren.
    Kurulum gerektirmez. Windows PowerShell 5.1+ ile çalışır.

    Çalıştırma:
        powershell -ExecutionPolicy Bypass -File .\cloudquest.ps1

    İçerik (chapter + quest) TEK KAYNAKTAN gelir: data\curriculum.json
    (web sürümüyle ortak). Komut doğrulama, web'deki parser.js ile aynı
    yapısal 'expect' eşleştirmesini kullanır (regex değil).
#>

$ErrorActionPreference = 'Stop'
$SaveFile = Join-Path $PSScriptRoot 'data\save.json'

# ---------------------------------------------------------------------------
#  Görsel yardımcılar
# ---------------------------------------------------------------------------
function C($text, $color = 'Gray', [switch]$NoNewline) {
    if ($NoNewline) { Write-Host $text -ForegroundColor $color -NoNewline }
    else            { Write-Host $text -ForegroundColor $color }
}

function Line { C ('-' * 64) DarkGray }

function Narrate($lines) {
    foreach ($l in $lines) { C $l White; Start-Sleep -Milliseconds 90 }
}

function Show-Banner {
    Clear-Host
    C '   ____ _                 _  ___                  _   ' Cyan
    C '  / ___| | ___  _   _  __| |/ _ \ _   _  ___  ___| |_ ' Cyan
    C ' | |   | |/ _ \| | | |/ _` | | | | | | |/ _ \/ __| __|' Cyan
    C ' | |___| | (_) | |_| | (_| | |_| | |_| |  __/\__ \ |_ ' Blue
    C '  \____|_|\___/ \__,_|\__,_|\__\_\\__,_|\___||___/\__|' Blue
    C ''
    C '        >> Cloud Engineering RPG  ::  live terminal <<' DarkCyan
    Line
}

# ---------------------------------------------------------------------------
#  Rank & seviye
# ---------------------------------------------------------------------------
function Get-Rank($level) {
    if     ($level -ge 12) { 'Principal Cloud Wizard 🧙' }
    elseif ($level -ge 10) { 'Cloud Architect 🏛️' }
    elseif ($level -ge 8)  { 'Senior Cloud Engineer' }
    elseif ($level -ge 5)  { 'Cloud Engineer' }
    elseif ($level -ge 3)  { 'Junior Cloud Engineer' }
    elseif ($level -ge 2)  { 'Associate ☁️' }
    else                   { 'Intern ☁️' }
}

function XP-ToNext($level) { return $level * 120 }

function Add-XP($amount) {
    $Global:Player.XP += $amount
    C "   +$amount XP" Yellow
    while ($Global:Player.XP -ge (XP-ToNext $Global:Player.Level)) {
        $Global:Player.XP -= (XP-ToNext $Global:Player.Level)
        $Global:Player.Level++
        $newRank = Get-Rank $Global:Player.Level
        C ''
        C "   ⭐ LEVEL UP!  ->  Level $($Global:Player.Level)" Magenta
        C "   Yeni rank: $newRank" Magenta
        $Global:Player.Rank = $newRank
    }
}

function Add-Credits($amount) {
    $Global:Player.Credits += $amount
    C "   +$amount cloud credits 💠" Cyan
}

# ---------------------------------------------------------------------------
#  Save / Load
# ---------------------------------------------------------------------------
function Save-Game {
    $dir = Split-Path $SaveFile
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $Global:Player | ConvertTo-Json -Depth 6 | Out-File -FilePath $SaveFile -Encoding utf8
    C "   💾 Oyun kaydedildi." Green
}

function Load-Game {
    if (-not (Test-Path $SaveFile)) { return $null }
    try {
        $raw = Get-Content $SaveFile -Raw -Encoding UTF8 | ConvertFrom-Json
        return @{
            Name      = [string]$raw.Name
            Level     = [int]$raw.Level
            XP        = [int]$raw.XP
            Credits   = [int]$raw.Credits
            Rank      = [string]$raw.Rank
            Completed = @($raw.Completed)
            Badges    = @($raw.Badges)
            Story     = @($raw.Story)
        }
    } catch { return $null }
}

# ---------------------------------------------------------------------------
#  Oyuncu paneli
# ---------------------------------------------------------------------------
function XP-Bar($cur, $max) {
    $width = 24
    $filled = [math]::Floor(($cur / [math]::Max($max,1)) * $width)
    if ($filled -gt $width) { $filled = $width }
    return '[' + ('#' * $filled) + ('.' * ($width - $filled)) + ']'
}

function Show-Status {
    $p = $Global:Player
    Line
    C "   👤 $($p.Name)" White
    C "   Rank    : $($p.Rank)" Cyan
    C "   Level   : $($p.Level)   XP: $($p.XP)/$(XP-ToNext $p.Level)" Yellow
    C "   $(XP-Bar $p.XP (XP-ToNext $p.Level))" DarkYellow
    C "   Credits : $($p.Credits) 💠" Cyan
    C "   Badges  : $(if ($p.Badges.Count) { $p.Badges -join ', ' } else { '(henüz yok)' })" Green
    C "   Quest   : $(Story-Done) / $((Get-Quests).Count) tamamlandı" Gray
    Line
}

# ---------------------------------------------------------------------------
#  İÇERİK  —  TEK KAYNAK: data\curriculum.json
# ---------------------------------------------------------------------------
function Load-Curriculum {
    $path = Join-Path $PSScriptRoot 'data\curriculum.json'
    if (-not (Test-Path $path)) { throw "curriculum.json bulunamadi: $path" }
    return (Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json)
}
function Get-Chapters { $Global:Curriculum.chapters }
function Get-Quests   { $Global:Curriculum.quests }

# Advanced Lab quest'leri (hikâye QUESTS'ten ayrı; sayaçlara girmez)
function Lab-Quests {
    $out = @()
    foreach ($m in $Global:Curriculum.modules) { if ($m.status -eq 'active' -and $m.quests) { $out += $m.quests } }
    return @($out)
}
function Find-Quest($id) {
    $q = (Get-Quests) | Where-Object { $_.Id -eq $id } | Select-Object -First 1
    if (-not $q) { $q = (Lab-Quests) | Where-Object { $_.Id -eq $id } | Select-Object -First 1 }
    return $q
}
function Story-Done { @((Get-Quests) | Where-Object { $Global:Player.Completed -contains $_.Id }).Count }

# --- Story (perde) beat'leri ---
function Track-OfChapter($ch) {
    $Global:Curriculum.tracks | Where-Object { $_.chapters -contains $ch } | Select-Object -First 1
}
function Track-Quests($track) {
    @(Get-Quests | Where-Object { $track.chapters -contains $_.Chapter })
}
function Show-StoryBeat($beatId, $title, $lines) {
    if (-not $lines) { return }
    if (-not $Global:Player.Story) { $Global:Player.Story = @() }
    if ($Global:Player.Story -contains $beatId) { return }
    C ''
    C ("   === {0} {1}" -f $title, ('=' * [math]::Max(2, 46 - $title.Length))) Magenta
    foreach ($l in $lines) { C ("   {0}" -f $l) Gray; Start-Sleep -Milliseconds 90 }
    C ("   {0}" -f ('=' * 54)) Magenta
    C ''
    $Global:Player.Story = @($Global:Player.Story) + $beatId
    Save-Game
}
function Show-ActIntro($track) {
    if (-not $track) { return }
    $a = $Global:Curriculum.story.acts.$($track.id)
    if ($a) { Show-StoryBeat ("act:" + $track.id + ":intro") ("> " + $a.title) $a.intro }
}
function Show-ActOutro($track) {
    if (-not $track) { return }
    $a = $Global:Curriculum.story.acts.$($track.id)
    if ($a) { Show-StoryBeat ("act:" + $track.id + ":outro") ("+ " + $a.title) $a.outro }
}
function Show-QuestBeat($qid, $when) {
    if (-not $Global:Curriculum.story.beats) { return }
    $b = $Global:Curriculum.story.beats.$qid
    if ($b -and $b.when -eq $when) { Show-StoryBeat ("beat:" + $qid) $b.title $b.lines }
}

# ---------------------------------------------------------------------------
#  Komut parser & doğrulayıcı  (web/js/parser.js ile aynı mantık)
#  expect: { cmd=[...], need=[...] }  ya da  { anyOf=[spec,...] }
#  Eşleyici: "a|b" alternatif, "re:PAT" regex.  sudo/pipe/&&/fazladan-flag toleransli.
# ---------------------------------------------------------------------------
function CQ-Tokenize($segment) {
    $tokens = @(); $cur = ''; $quote = $null
    foreach ($ch in $segment.ToCharArray()) {
        if ($quote) {
            if ($ch -eq $quote) { $quote = $null } else { $cur += $ch }
        } elseif ($ch -eq '"' -or $ch -eq "'") {
            $quote = $ch
        } elseif ($ch -eq ' ' -or $ch -eq "`t") {
            if ($cur -ne '') { $tokens += $cur; $cur = '' }
        } else {
            $cur += $ch
        }
    }
    if ($cur -ne '') { $tokens += $cur }
    if ($tokens.Count -gt 1 -and $tokens[0].ToLower() -eq 'sudo') {
        $tokens = $tokens[1..($tokens.Count - 1)]
    } elseif ($tokens.Count -eq 1 -and $tokens[0].ToLower() -eq 'sudo') {
        $tokens = @()
    }
    return ,$tokens
}

function CQ-Segments($raw) {
    ($raw -replace '&&|;', '|') -split '\|' |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -ne '' }
}

function CQ-TokenMatch($token, $matcher) {
    if ($matcher.StartsWith('re:')) {
        return [bool]($token -cmatch $matcher.Substring(3))
    }
    return (($matcher -split '\|') -ccontains $token)
}

function CQ-MatchSpec($tokens, $spec) {
    $cmd = @(); if ($spec.cmd) { $cmd = @($spec.cmd) }
    if ($tokens.Count -lt $cmd.Count) { return $false }
    for ($i = 0; $i -lt $cmd.Count; $i++) {
        if (-not (CQ-TokenMatch $tokens[$i] $cmd[$i])) { return $false }
    }
    $remaining = @()
    if ($tokens.Count -gt $cmd.Count) { $remaining = @($tokens[$cmd.Count..($tokens.Count - 1)]) }
    $need = @(); if ($spec.need) { $need = @($spec.need) }
    $used = @($false) * $remaining.Count
    foreach ($m in $need) {
        $found = $false
        for ($j = 0; $j -lt $remaining.Count; $j++) {
            if (-not $used[$j] -and (CQ-TokenMatch $remaining[$j] $m)) {
                $used[$j] = $true; $found = $true; break
            }
        }
        if (-not $found) { return $false }
    }
    return $true
}

function CQ-Match($raw, $expect) {
    if ($null -eq $expect) { return $false }
    if ($expect.anyOf) {
        foreach ($sub in $expect.anyOf) { if (CQ-Match $raw $sub) { return $true } }
        return $false
    }
    foreach ($seg in (CQ-Segments $raw)) {
        if (CQ-MatchSpec (CQ-Tokenize $seg) $expect) { return $true }
    }
    return $false
}

# ---------------------------------------------------------------------------
#  Quest durumu & listeleme
# ---------------------------------------------------------------------------
function Quest-Status($q) {
    if ($Global:Player.Completed -contains $q.Id) { return 'done' }
    foreach ($req in $q.Requires) {
        if ($Global:Player.Completed -notcontains $req) { return 'locked' }
    }
    return 'available'
}

function Show-Quests {
    Line
    C '   📜 QUEST GÜNLÜĞÜ' White
    C ''
    foreach ($q in Get-Quests) {
        $st = Quest-Status $q
        switch ($st) {
            'done'      { C ("   ✅ [{0}] {1}  (ch{2})" -f $q.Id, $q.Title, $q.Chapter) DarkGray }
            'available' { C ("   ▶  [{0}] {1}  (ch{2})  +{3}XP" -f $q.Id, $q.Title, $q.Chapter, $q.XP) Green }
            'locked'    { C ("   🔒 [{0}] {1}  (önce: {2})" -f $q.Id, $q.Title, ($q.Requires -join ',')) DarkRed }
        }
    }
    C ''
    C '   Başlatmak için:  quest <id>     (örn: quest c1q1)' Cyan
    Line
}

function Show-Map {
    Line
    C '   🗺️  CLOUDQUEST HARİTASI' White
    C ''
    foreach ($ch in Get-Chapters) {
        $qs = @((Get-Quests) | Where-Object { $_.Chapter -eq $ch.N })
        $total = $qs.Count
        $done  = @($qs | Where-Object { $Global:Player.Completed -contains $_.Id }).Count
        $mark = if ($total -eq 0) { '  ' } elseif ($done -eq $total) { '✅' } elseif ($done -gt 0) { '⏳' } else { '⬜' }
        $prog = if ($total -gt 0) { "$done/$total" } else { '—' }
        C ("   {0}  Ch{1}. {2,-24} {3}" -f $mark, $ch.N, $ch.Title, $prog) $(if($done -eq $total -and $total -gt 0){'Green'}else{'White'})
        C ("        {0}" -f $ch.Desc) DarkGray
    }
    Line
}

# ---------------------------------------------------------------------------
#  Quest oynatma döngüsü
# ---------------------------------------------------------------------------
function Show-Labs {
    Line
    C '   🔮 ADVANCED LABS' White
    C ''
    foreach ($m in $Global:Curriculum.modules) {
        $tag = if ($m.status -eq 'active') { '✅ hazır' } else { '🔒 yakında' }
        C ("   {0}  {1,-14}{2,-22}{3}" -f $m.icon, ("[" + $m.id + "]"), $m.title, $tag) $(if ($m.status -eq 'active') { 'Green' } else { 'DarkRed' })
        C ("        {0}" -f $m.desc) DarkGray
    }
    C ''
    C '   Detay:  lab <id>   (ör: lab net)' Cyan
    Line
}

function Show-Lab($id) {
    $m = $Global:Curriculum.modules | Where-Object { $_.id -eq ("$id").ToLower() } | Select-Object -First 1
    if (-not $m) { C "   ❌ Böyle bir modül yok: $id" Red; return }
    Line
    C ("   {0}  MODÜL: {1}   [{2}]" -f $m.icon, $m.title, $m.id) Magenta
    C ("   {0}" -f $m.desc) DarkGray
    C ''
    if ($m.status -eq 'active' -and $m.quests) {
        C '   📋 LAB GÖREVLERİ' White
        foreach ($q in $m.quests) {
            switch (Quest-Status $q) {
                'done'      { C ("   ✅ [{0}] {1}" -f $q.Id, $q.Title) DarkGray }
                'available' { C ("   ▶  [{0}] {1}   +{2} XP" -f $q.Id, $q.Title, $q.XP) Green }
                'locked'    { C ("   🔒 [{0}] {1}" -f $q.Id, $q.Title) DarkRed }
            }
        }
        $nxt = $m.quests | Where-Object { (Quest-Status $_) -eq 'available' } | Select-Object -First 1
        C ''
        if ($nxt) { C ("   Başlamak için:  quest {0}" -f $nxt.Id) Cyan } else { C '   🎉 Bu lab tamamlandı!' Magenta }
    } else {
        C '   🔒 Bu modül henüz pasif (yakında).' DarkRed
    }
    Line
}

function Play-Quest($id) {
    $q = Find-Quest $id
    if (-not $q) { C "   ❌ Böyle bir quest yok: $id" Red; return }
    $st = Quest-Status $q
    if ($st -eq 'done')   { C "   ✅ Bu quest zaten tamamlandı." Yellow; return }
    if ($st -eq 'locked') { C "   🔒 Kilitli. Önce tamamla: $($q.Requires -join ', ')" Red; return }

    Clear-Host
    Line
    C "   ▶ QUEST: $($q.Title)   [$($q.Id)]" Magenta
    Line
    $track = Track-OfChapter $q.Chapter
    if ($track -and (Track-Quests $track)[0].Id -eq $q.Id) { Show-ActIntro $track }
    Show-QuestBeat $q.Id 'intro'
    Narrate $q.Brief
    C ''
    C '   (komutlar: hint = ipucu, task = görevi tekrar göster, abandon = çık)' DarkGray
    C ''

    $i = 0
    while ($i -lt $q.Objectives.Count) {
        $obj = $q.Objectives[$i]
        C ("   -- Görev $($i+1)/$($q.Objectives.Count) " + ('-' * 30)) DarkCyan
        C "   🎯 $($obj.task)" White
        C "   💡 $($obj.teach)" DarkGray

        $solved = $false
        while (-not $solved) {
            C ''
            C "   cloudquest " Cyan -NoNewline
            C "$($Global:Player.Name)@aws" DarkGray -NoNewline
            C ' $ ' Cyan -NoNewline
            $cmdT = (Read-Host).Trim()

            if ($cmdT -match '^(abandon|exit|back|çık)$') {
                C '   ↩  Quest''ten çıkıldı (ilerleme kaydedilmedi).' Yellow
                return
            }
            elseif ($cmdT -match '^(hint|ipucu)$') {
                C "   💬 İpucu: $($obj.hint)" Yellow
            }
            elseif ($cmdT -match '^(task|görev|look)$') {
                C "   🎯 $($obj.task)" White
            }
            elseif ([string]::IsNullOrWhiteSpace($cmdT)) {
                # boş enter — prompt'u tekrarla
            }
            elseif (CQ-Match $cmdT $obj.expect) {
                C "   ✔ $($obj.success)" Green
                $solved = $true
                $i++
            }
            else {
                C "   ✖ Tam olmadı. 'hint' yaz ya da tekrar dene." Red
            }
        }
    }

    C ''
    Line
    Narrate $q.Complete
    Show-QuestBeat $q.Id 'complete'
    Add-XP $q.XP
    Add-Credits $q.Credits
    if ($q.Badge -and ($Global:Player.Badges -notcontains $q.Badge)) {
        $Global:Player.Badges = @($Global:Player.Badges) + $q.Badge
        C "   🏅 Yeni rozet: $($q.Badge)" Magenta
    }
    if ($Global:Player.Completed -notcontains $q.Id) {
        $Global:Player.Completed = @($Global:Player.Completed) + $q.Id
    }
    Save-Game
    $track = Track-OfChapter $q.Chapter
    if ($track -and (Track-Quests $track)[-1].Id -eq $q.Id) { Show-ActOutro $track }
    Line
    C '   Devam etmek için Enter...' DarkGray
    [void](Read-Host)
}

# ---------------------------------------------------------------------------
#  Shop
# ---------------------------------------------------------------------------
function Show-Shop {
    Line
    C '   🛒 CLOUD SHOP   (credits ile al)' White
    C "   Bakiyen: $($Global:Player.Credits) 💠" Cyan
    C ''
    foreach ($item in $Global:Curriculum.shop) {
        C ("   {0}) {1}  {2,-22} {3} 💠  — {4}" -f $item.id, $item.icon, $item.name, $item.cost, $item.desc) Green
    }
    C ''
    C '   Satın almak: buy <n>   (örn: buy 1)' Cyan
    Line
}

function Buy-Item($n) {
    $item = $Global:Curriculum.shop | Where-Object { "$($_.id)" -eq "$n" } | Select-Object -First 1
    if (-not $item) { C "   ❌ Geçersiz seçim. 'shop' ile ürünleri gör." Red; return }
    if ($Global:Player.Credits -lt $item.cost) { C "   ❌ Yetersiz credit ($($item.cost) gerekli)." Red; return }
    if ($item.effect.badge -and ($Global:Player.Badges -contains $item.effect.badge)) { C '   Bu ünvana zaten sahipsin.' Yellow; return }
    $Global:Player.Credits -= $item.cost
    C "   🛍️  Satın alındı: $($item.name)" Cyan
    if ($item.effect.xp)    { Add-XP $item.effect.xp }
    if ($item.effect.badge) { $Global:Player.Badges = @($Global:Player.Badges) + $item.effect.badge; C "   🏅 Yeni rozet: $($item.effect.badge)" Magenta }
    Save-Game
}

# ---------------------------------------------------------------------------
#  Yardım
# ---------------------------------------------------------------------------
function Show-Help {
    Line
    C '   KOMUTLAR' White
    C '   quests            ' Cyan -NoNewline; C 'quest günlüğünü göster' Gray
    C '   quest <id>        ' Cyan -NoNewline; C 'bir questi başlat (örn: quest c1q1)' Gray
    C '   map               ' Cyan -NoNewline; C 'bölüm/ilerleme haritası' Gray
    C '   labs / lab <id>   ' Cyan -NoNewline; C 'Advanced Labs (ör: lab net)' Gray
    C '   status / me       ' Cyan -NoNewline; C 'karakter panelin' Gray
    C '   shop              ' Cyan -NoNewline; C 'credit dükkanı' Gray
    C '   buy <n>           ' Cyan -NoNewline; C 'shop''tan ürün al' Gray
    C '   save / load       ' Cyan -NoNewline; C 'kaydet / yükle' Gray
    C '   roadmap           ' Cyan -NoNewline; C 'çalışma programını aç (docs/ROADMAP.md)' Gray
    C '   reset             ' Cyan -NoNewline; C 'ilerlemeni sıfırla (onaylı)' Gray
    C '   clear             ' Cyan -NoNewline; C 'ekranı temizle' Gray
    C '   help              ' Cyan -NoNewline; C 'bu liste' Gray
    C '   quit              ' Cyan -NoNewline; C 'çık (otomatik kaydeder)' Gray
    Line
}

# ---------------------------------------------------------------------------
#  Giriş / boot
# ---------------------------------------------------------------------------
function New-Player($name) {
    return @{
        Name=$name; Level=1; XP=0; Credits=60; Rank=(Get-Rank 1)
        Completed=@(); Badges=@(); Story=@()
    }
}

function Reset-Progress {
    C '   ⚠ Tüm ilerleme sıfırlanacak: level, XP, credits, quest, rozet.' Yellow
    C '   Adın korunur. Emin misin? (evet/hayir)' Yellow
    C '   > ' Cyan -NoNewline
    $a = (Read-Host).Trim().ToLower()
    if ($a -eq 'evet' -or $a -eq 'e' -or $a -eq 'yes' -or $a -eq 'y') {
        $Global:Player = New-Player $Global:Player.Name
        Save-Game
        C '   ♻ İlerleme sıfırlandı. Temiz başlangıç!' Green
    } else {
        C '   İptal edildi. İlerlemen duruyor.' Gray
    }
}

function Ask-Name {
    C ''
    C '   Adın ne, engineer? ' White -NoNewline
    $n = (Read-Host).Trim()
    if ([string]::IsNullOrWhiteSpace($n)) { $n = 'engineer' }
    return $n
}

function Open-Roadmap {
    $rm = Join-Path $PSScriptRoot 'docs\ROADMAP.md'
    if (Test-Path $rm) {
        C "   📖 Çalışma programı: $rm" Cyan
        try { Invoke-Item $rm } catch { C '   (dosyayı manuel açabilirsin)' DarkGray }
    } else { C '   ROADMAP.md bulunamadı.' Red }
}

function Start-Game {
    Show-Banner
    $existing = Load-Game
    if ($existing) {
        C "   Kayıt bulundu: $($existing.Name) — Level $($existing.Level), $($existing.Completed.Count) quest." Green
        C '   Devam et? (E/h)  |  Yeni oyun için: yeni' White
        C '   > ' Cyan -NoNewline
        $ans = (Read-Host).Trim().ToLower()
        if ($ans -eq 'yeni' -or $ans -eq 'new') {
            $Global:Player = New-Player (Ask-Name)
        } else {
            $Global:Player = $existing
            C "   Tekrar hoş geldin, $($Global:Player.Name)!" Cyan
        }
    } else {
        $Global:Player = New-Player (Ask-Name)
        Show-StoryBeat 'prologue' ($Global:Curriculum.story.startup + ' - Prolog') $Global:Curriculum.story.prologue
        C ''
        C '   [Nova]: Baslamak icin: quests -> quest c1q1.  (yardim: help)' Green
    }
    Start-Sleep -Milliseconds 300
    Game-Loop
}

# ---------------------------------------------------------------------------
#  Ana döngü
# ---------------------------------------------------------------------------
function Game-Loop {
    while ($true) {
        C ''
        C 'cloudquest ' Cyan -NoNewline
        C "$($Global:Player.Name)" Green -NoNewline
        C ' > ' Cyan -NoNewline
        $raw = Read-Host
        $cmd = ($raw).Trim()
        $parts = $cmd -split '\s+', 2
        $verb = $parts[0].ToLower()
        $arg  = if ($parts.Count -gt 1) { $parts[1].Trim() } else { '' }

        switch ($verb) {
            ''         { }
            'help'     { Show-Help }
            '?'        { Show-Help }
            'quests'   { Show-Quests }
            'quest'    { if ($arg) { Play-Quest $arg } else { C '   Kullanım: quest <id>  (bkz: quests)' Yellow } }
            'start'    { if ($arg) { Play-Quest $arg } else { C '   Kullanım: start <id>' Yellow } }
            'map'      { Show-Map }
            'labs'     { Show-Labs }
            'lab'      { if ($arg) { Show-Lab $arg } else { C '   Kullanım: lab <id>  (bkz: labs)' Yellow } }
            'status'   { Show-Status }
            'me'       { Show-Status }
            'shop'     { Show-Shop }
            'buy'      { Buy-Item $arg }
            'save'     { Save-Game }
            'load'     { $l = Load-Game; if ($l) { $Global:Player = $l; C '   Yüklendi.' Green } else { C '   Kayıt yok.' Red } }
            'roadmap'  { Open-Roadmap }
            'reset'    { Reset-Progress }
            'clear'    { Show-Banner }
            'cls'      { Show-Banner }
            'quit'     { Save-Game; C '   Görüşürüz, engineer! 👋' Cyan; return }
            'exit'     { Save-Game; C '   Görüşürüz! 👋' Cyan; return }
            default    { C "   Bilinmeyen komut: '$verb'.  'help' yaz." Red }
        }
    }
}

# ---------------------------------------------------------------------------
#  Başlat (CQ_NO_AUTOSTART ayarlıysa sadece fonksiyonlar yüklenir — test için)
# ---------------------------------------------------------------------------
$Global:Curriculum = Load-Curriculum
if (-not $env:CQ_NO_AUTOSTART) {
    Start-Game
}
