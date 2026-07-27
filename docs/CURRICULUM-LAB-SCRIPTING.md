# 📜 Advanced Lab: Scripting

> Hikâyeden bağımsız yan modül: Bash ile otomasyon. İstediğin zaman oynanır; XP/rozet
> verir ama "hazırlık %" (story) sayacını etkilemez.

Kaynak: roadmap.sh (Linux — Shell Programming / Text Processing) + genel Bash pratiği.
**4 quest**, bir yedekleme/log-analiz script'i adım adım büyür.

| Quest | id | Konu | Komutlar |
|-------|----|------|----------|
| Script Çekirdeği | `scrq1` | exec, argüman ($1), exit code ($?), debug | `chmod +x` · `./script arg` · `echo $?` · `bash -x` |
| Mantık Devresi | `scrq2` | değişken, döngü, koşul | `echo "$var"` · `for..in` · `if [ ]` · `while read` |
| Metin Madenciliği | `scrq3` | log parsing | `grep` · `awk '{print $1}'` · `sed 's///'` · `sort\|uniq -c` |
| Zamanlayıcı | `scrq4` | zamanlama & sağlamlık | `crontab -l/-e` · `bash -n` · `set -euo pipefail` |

Rozetler: 🐚 Shell Novice · 🌀 Flow Scripter · 🧵 Text Weaver · ⏰ Cron Master.

## Erişim
`labs` / `lab scripting` → `quest scrq1` (web'de ana sayfa Advanced Labs kartından da).

## Not
Örnekler Bash odaklı (parser komut satırlarını doğrular; çok satırlı script gövdesi
değil). Gerçekte: `#!/bin/bash` + `set -euo pipefail` ile başlayan, argüman alan,
loglayan küçük script'ler yazıp `cron`'a bağlamak — bu lab onun kas hafızasını verir.
