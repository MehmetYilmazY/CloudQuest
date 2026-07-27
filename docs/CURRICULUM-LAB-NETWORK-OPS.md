# 🛰️ Advanced Lab: Network Ops

> İlk aktif **Advanced Lab**. Hikâye kampanyasından (8 bölüm) **bağımsız** yan içerik:
> ağ teşhisi odaklı, gerçek arıza senaryoları. İstediğin zaman oynanır; XP/rozet verir
> ama "Cloud Engineer hazırlığı %" (story) sayacını **etkilemez**.

Kaynak: roadmap.sh (Linux/DevOps ağ konuları) — port tarama, DNS & routing, paket
yakalama, firewall/route debug. **4 quest**, bir arıza baştan sona teşhis edilir.

| Quest | id | Konu | Komutlar |
|-------|----|------|----------|
| Port Haritası | `netq1` | Port tarama & dinleyenler | `nmap` · `ss/netstat` · `lsof/fuser` · `nc` |
| DNS Labirenti | `netq2` | DNS zinciri & routing | `dig +trace` · `dig -x` · `ip route` · `mtr` |
| Paket Avcısı | `netq3` | Paket & TLS inceleme | `tcpdump` · `curl -v` · `openssl s_client` · `tshark` |
| Duvar Ardında | `netq4` | Firewall & doğrulama | `iptables/nft/ufw` · `nc` · `ufw allow` · `curl -I` |

Rozetler: 🔌 Port Hunter · 📡 Route Tracer · 🕸️ Packet Catcher · 🚧 Firewall Tamer.

## Erişim
- **Web**: ana sayfada **Advanced Labs** grid'inde "Network Ops" kartı (✅ hazır) → tıkla,
  ya da terminalde `labs` / `lab net`, sonra `quest netq1`.
- **PowerShell**: `labs` / `lab net`, sonra `quest netq1`.

## Teknik (SSOT)
Lab quest'leri `data/curriculum.json` içinde ilgili modülün `quests[]` dizisinde durur
(modül `status: "active"`). Hikâye QUESTS'inden ayrıdır: `map`, quest günlüğü, profil
"tamamlanan modüller" ve "hazırlık %" yalnızca story quest'lerini sayar (web `storyDone()`,
PowerShell `Story-Done`). Yeni lab açmak = ilgili modülü `active` yap + `quests[]` doldur.
