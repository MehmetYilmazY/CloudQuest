# 📚 Fundamentals Müfredatı (Ch1–2)

> Kaynak: [roadmap.sh/linux](https://roadmap.sh/linux) ve [roadmap.sh/devops](https://roadmap.sh/devops)
> (Terminal Knowledge · Text Manipulation · Process/Service/Package Management ·
> Networking & Protocols · Version Control) baz alınarak hazırlandı.
> Hedef: tam yeni başlayanı, cloud'a girmeden önce terminal + ağ + Git temellerinde sağlamlaştırmak.

Fundamentals modülü **10 eğitim (quest)** içerir. Her eğitim gerçek bir iş senaryosuna bağlıdır ve
mentör Aria eşliğinde ilerler. Konu → eğitim eşlemesi:

## Ch1 — Terminal & Linux (6 eğitim)

| Eğitim | id | Roadmap konusu | Komutlar |
|--------|----|----------------|----------|
| İlk Gün | `c1q1` | Navigation Basics, Editing/Viewing | `pwd` `ls` `cat` `cd` |
| Dosya Düzeni | `c1q2` | Creating/Moving/Deleting Files & Dirs | `cd ..` `~` `mkdir` `cp` `mv` `rm` |
| Log Avı | `c1q3` | Text Processing (stdout, grep, find, wc) | `tail` `grep` `find` `wc -l` |
| Kayıp İzin | `c1q4` | File Permissions, Super User | `ls -l` `chmod` `./script` |
| Kaçak Süreç | `c1q5` | Process Management, Server Review | `ps` `kill` `df -h` |
| Kurulum Günü | `c1q6` | Package + Service (systemd) + Env Vars | `apt install` `systemctl` `export` |

## Ch2 — Networking & Git (4 eğitim)

| Eğitim | id | Roadmap konusu | Komutlar |
|--------|----|----------------|----------|
| Sinyal Yok | `c2q1` | ICMP, DNS Resolution, HTTP | `ping` `nslookup/dig` `curl` |
| Katman Katman | `c2q2` | Troubleshooting, IP Routing, SSH, File Transfer | `traceroute` `ss/netstat` `ssh` `scp` |
| İlk Commit | `c2q3` | Version Control: temel akış | `git clone` `checkout -b` `commit` `push` |
| Zaman Makinesi | `c2q4` | Version Control: geçmiş & senkron | `git status` `diff` `log` `pull` `merge` |

## Öğrenme döngüsü
**Öğren** (linuxjourney.com, MIT Missing Semester, Pro Git) → **Oyna** (bu modül) →
**Uygula** (bir Linux VM'de SSH, nginx kur; bir repoyu fork'la, PR gönder).

## Sıradaki
Fundamentals bitince modül tamamlanır ve **Cloud Core (AWS)** açılır.
İleri uzmanlık için `labs` (Network Ops, Scripting, Docker, Terraform, Ansible, Kubernetes).
