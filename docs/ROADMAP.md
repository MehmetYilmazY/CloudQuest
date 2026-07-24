# ☁️ CloudQuest — Cloud Engineering Çalışma Programı

> 6 aylık, haftalık planlı, "junior → job-ready" cloud engineer yol haritası.
> Her bölüm (chapter) oyundaki bir bölümle birebir eşleşir. Konuyu **oku → oyunda quest'i çöz → gerçekte uygula** döngüsüyle ilerle.

## Nasıl çalışılır (döngü)

1. **Öğren** (haftada ~5 saat teori): aşağıdaki kaynaklardan bölümün konusunu oku/izle.
2. **Oyna** (haftada ~2 saat): `cloudquest.ps1` içinde ilgili bölümün quest'lerini bitir — komutları kas hafızasına al.
3. **Uygula** (haftada ~3 saat): gerçek bir bulut hesabında (AWS Free Tier) veya lokalde mini bir proje yap.
4. **Not al**: her hafta öğrendiğini `docs/notes/` altında bir markdown dosyasına yaz.

**Haftalık hedef: ~10 saat.** Sürdürülebilirlik > hız. Streak'ini bozma.

---

## 📅 Genel Takvim

| Ay | Bölüm | Konu | Oyun Chapter |
|----|-------|------|:---:|
| 1 | Foundations | Linux, terminal, Git, ağın temeli | 1–2 |
| 2 | Cloud Core | AWS: IAM, EC2, VPC, S3, RDS | 3 |
| 3 | IaC | Terraform ile altyapıyı kodla | 4 |
| 4 | Containers | Docker + Kubernetes | 5 |
| 5 | Otomasyon | CI/CD, GitHub Actions, gözlemlenebilirlik | 6–7 |
| 6 | Ustalık | Güvenlik, maliyet, sertifika (AWS SAA) | 8 + sınav |

---

> 📚 **Fundamentals (Ch1–2) detaylı müfredatı** ve oyundaki 10 eğitime eşlemesi:
> [`docs/CURRICULUM-FUNDAMENTALS.md`](CURRICULUM-FUNDAMENTALS.md) — roadmap.sh temelli.

## Bölüm 1 — Foundations: Terminal & Linux (Hafta 1–2)

**Neden:** Cloud engineer'ın günlük dili terminaldir. Sunucular Linux'tur.

- Dosya sistemi: `ls, cd, pwd, cp, mv, rm, mkdir, cat, less, grep, find`
- İzinler: `chmod, chown`, kullanıcı/grup mantığı
- Süreçler: `ps, top, kill`, servisler (`systemctl`)
- Paket yönetimi, ortam değişkenleri, SSH ile bağlanma
- Bash script temelleri: değişken, döngü, koşul

**Proje:** Bir VM'e SSH ile bağlan, bir web sunucusu (nginx) kur, servisi başlat.
**Kaynak:** *Linux Journey* (linuxjourney.com), *The Missing Semester* (MIT), OverTheWire **Bandit** (oyunlaştırılmış Linux).

## Bölüm 2 — Networking & Git (Hafta 3–4)

- TCP/IP, portlar, DNS, HTTP/HTTPS, TLS
- Subnet / CIDR (`10.0.0.0/16` ne demek), NAT, firewall
- Load balancer, reverse proxy kavramı
- Git: `clone, add, commit, push, pull, branch, merge`, PR akışı

**Proje:** Bir domain al (opsiyonel), DNS kayıtlarını yönet; bir repoyu fork'la, branch açıp PR gönder.
**Kaynak:** *Computer Networking: A Top-Down Approach* (özet), *Pro Git* kitabı (ücretsiz).

## Bölüm 3 — Cloud Core: AWS (Hafta 5–8)

> ☁️ **Cloud Core (Ch3) detaylı müfredatı** ve oyundaki 5 eğitime eşlemesi:
> [`docs/CURRICULUM-CLOUD-CORE.md`](CURRICULUM-CLOUD-CORE.md) — roadmap.sh/aws temelli.

**En kritik bölüm.** Bir bulut sağlayıcıda derinleş (AWS öneriliyor, mantık diğerlerine transfer olur).

- **IAM:** kullanıcı, rol, policy, least privilege
- **EC2:** sanal sunucu, AMI, security group, key pair
- **VPC:** subnet, route table, internet/NAT gateway
- **S3:** object storage, bucket policy, versioning
- **RDS:** managed veritabanı
- Fatura & Free Tier alarmları (maliyet kontrolü!)

**Proje:** VPC içinde bir EC2 aç, üstüne uygulama koy, S3'ten statik dosya sun, RDS'e bağla.
**Kaynak:** AWS resmi *Skill Builder*, *freeCodeCamp AWS* kursları, AWS dokümantasyonu.

## Bölüm 4 — Infrastructure as Code: Terraform (Hafta 9–12)

> 🌍 **IaC (Ch4) detaylı müfredatı** ve oyundaki 4 eğitime eşlemesi:
> [`docs/CURRICULUM-IAC.md`](CURRICULUM-IAC.md) — roadmap.sh/terraform temelli.

- Neden IaC? Tıklamak yerine kodla, versiyonla, tekrar üret.
- `provider, resource, variable, output, state`
- `terraform init / plan / apply / destroy`
- Modüller, remote state, workspace

**Proje:** Bölüm 3'te elle yaptığın altyapıyı tamamen Terraform ile kur ve yık.
**Kaynak:** HashiCorp *Learn Terraform*, *Terraform: Up & Running* kitabı.

## Bölüm 5 — Containers: Docker & Kubernetes (Hafta 13–17)

> 🐳 **Containers (Ch5) detaylı müfredatı** ve oyundaki 4 eğitime eşlemesi:
> [`docs/CURRICULUM-CONTAINERS.md`](CURRICULUM-CONTAINERS.md) — roadmap.sh/docker & /kubernetes temelli.

- **Docker:** image, container, `Dockerfile`, volume, network, `docker compose`
- **Kubernetes:** pod, deployment, service, configmap/secret, ingress
- `kubectl` temelleri, Helm'e giriş

**Proje:** Bir uygulamayı Dockerize et, `docker compose` ile ayağa kaldır; sonra lokal Kubernetes'te (kind/minikube) deploy et.
**Kaynak:** *Docker Getting Started*, *Kubernetes Up & Running*, KillerCoda interaktif senaryolar.

## Bölüm 6 — CI/CD & Otomasyon (Hafta 18–20)

> 🔁 **Automation (Ch6–7) detaylı müfredatı** ve oyundaki 4 eğitime eşlemesi:
> [`docs/CURRICULUM-AUTOMATION.md`](CURRICULUM-AUTOMATION.md) — roadmap.sh/devops temelli.

- Pipeline mantığı: build → test → deploy
- GitHub Actions: workflow, job, step, secrets
- Otomatik test, container build & push, deploy adımları

**Proje:** Push'ta otomatik test çalıştıran, image build edip deploy eden bir pipeline kur.

## Bölüm 7 — Observability (Hafta 21–22)

- Loglama, metrikler, trace (3 sütun)
- Prometheus + Grafana, CloudWatch
- Alerting, dashboard, SLO/SLI kavramı

**Proje:** Uygulamana metrik ekle, Grafana'da dashboard çiz, alarm kur.

## Bölüm 8 — Güvenlik, Maliyet & Sertifika (Hafta 23–26)

> 🎓 **Mastery (Ch8) detaylı müfredatı** ve oyundaki 3 eğitime eşlemesi:
> [`docs/CURRICULUM-MASTERY.md`](CURRICULUM-MASTERY.md) — AWS Well-Architected (Security + Cost) temelli.

- Least privilege, secret yönetimi, network güvenliği
- Maliyet optimizasyonu, right-sizing, tagging
- **Sertifika:** *AWS Certified Solutions Architect – Associate* (SAA-C03) için pratik sınavlar

**Bitirme Projesi:** Uçtan uca — Terraform ile kurulan, containerize, CI/CD'li, izlenebilir bir uygulama. Bunu GitHub'a koy, CV'nin merkezine al.

---

## 🔮 Gelecek Modüller — Advanced Labs (yakında)

8 bölümlük hikâye "job-ready" seviyesine getirir. Sonrasında derinleşmek için
planlanan uzmanlık modülleri (şimdilik oyunda **pasif placeholder** olarak durur;
oyunda `labs` / `lab <id>` ile görülür, ana ilerleme %'sini etkilemez):

| Modül | id | Kapsam |
|-------|----|--------|
| 🛰️ Network Ops | `net` | ping/traceroute/dns/nmap/tcpdump ile ağ teşhis oyunları |
| 📜 Scripting | `scripting` | Bash & Python otomasyon senaryoları |
| 🐳 Docker Deep Dive | `docker` | imaj katmanı, volume, network, multi-stage, compose |
| 🌍 Terraform Pro | `terraform` | modül, remote state, workspace, drift, import |
| ⚙️ Ansible | `ansible` | playbook, role, inventory, idempotency |
| ☸️ Kubernetes | `kubernetes` | deployment, service, ingress, config/secret, helm, debug |

> Bunlar tek tek eklenecek. Bir modül aktifleştirmek için `web/js/content.js`
> içindeki `MODULES` kaydında `status: "soon"` → `"active"` yapılır ve o modülün
> quest'leri `QUESTS`'e eklenir.

## 🎯 Prensip

- **%20 teori, %80 elin klavyede.** İzlemek değil, yapmak öğretir.
- Her şeyi ilk seferde anlamayacaksın — **normaldir**. İlerledikçe geriye dönünce netleşir.
- **Public bir portföy** (GitHub) senin sertifikandan çok daha çok konuşur.

İyi yolculuklar, engineer. Oyunda görüşürüz 👋
