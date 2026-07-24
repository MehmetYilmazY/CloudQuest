<#
    CloudQuest build - SSOT compiler
    data/curriculum.json  ->  web/js/content.generated.js

    Curriculum lives ONLY in data/curriculum.json. After editing it, run:
        powershell -ExecutionPolicy Bypass -File .\build.ps1
    The PowerShell game (cloudquest.ps1) reads the JSON directly, so it needs
    no build step; this script is only for the web (browser, file://) runtime.

    NOTE: kept ASCII-only on purpose (Windows PowerShell 5.1 reads .ps1 as ANSI).
#>
$ErrorActionPreference = 'Stop'
# Nested Join-Path => hem Windows PowerShell 5.1 hem pwsh (Linux CI) için doğru ayraç.
$root = $PSScriptRoot
$src  = Join-Path (Join-Path $root 'data') 'curriculum.json'
$dst  = Join-Path (Join-Path (Join-Path $root 'web') 'js') 'content.generated.js'

if (-not (Test-Path $src)) { throw "Source not found: $src" }

# Read as UTF-8 so emoji / Turkish characters survive round-trip.
$json = Get-Content $src -Raw -Encoding UTF8

# Build-time validation: is the JSON valid?
try { $data = $json | ConvertFrom-Json }
catch { throw "curriculum.json is INVALID JSON: $($_.Exception.Message)" }

$header = @"
/* ======================================================================
   AUTO-GENERATED from data/curriculum.json by build.ps1 - DO NOT EDIT.
   Edit the JSON, then run: powershell -ExecutionPolicy Bypass -File .\build.ps1
   ====================================================================== */
const CQ_DATA = $json;
const CHAPTERS = CQ_DATA.chapters;
const TRACKS   = CQ_DATA.tracks;
const QUESTS   = CQ_DATA.quests;
const MODULES  = CQ_DATA.modules;
const SHOP     = CQ_DATA.shop;
const STORY    = CQ_DATA.story;
"@

# Write UTF-8 without BOM (clean for a browser script tag).
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($dst, $header, $enc)

Write-Host ("OK - generated {0} ({1} quests)" -f $dst, $data.quests.Count) -ForegroundColor Green
