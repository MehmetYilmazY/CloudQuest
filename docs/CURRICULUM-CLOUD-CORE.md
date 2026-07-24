# ☁️ Cloud Core Müfredatı (Ch3 — AWS)

> Kaynak: [roadmap.sh/aws](https://roadmap.sh/aws) — "Step 1: Essentials (IAM → VPC → EC2)"
> ve "Step 2/3" (S3, RDS) sıralaması baz alındı.
> Hedef: Fundamentals'ı bitiren kullanıcıya, bir uygulamayı AWS'te **uçtan uca**
> ayağa kaldırmanın çekirdek yapı taşlarını öğretmek.

Cloud Core modülü **5 eğitim (quest)** içerir. roadmap.sh'in "önce kim, sonra ne"
mantığıyla kimlikten başlar, ağ → sunucu → depolama → veritabanı sırasıyla ilerler.
CloudWatch/ECS/EKS bilinçli olarak **dışarıda** — onlar Ch5 (Containers) ve Ch7
(Observability) modüllerinde işlenir (tekrar yok).

| Eğitim | id | Roadmap konusu | Komutlar (AWS CLI) |
|--------|----|----------------|--------------------|
| Kimlik & Erişim | `c3q1` | IAM: users, policies, roles, least privilege | `aws configure` · `iam create-user` · `iam attach-user-policy` · `iam create-role` |
| Ağı Kur | `c3q2` | VPC: CIDR, subnet, internet gateway, security group | `ec2 create-vpc` · `create-subnet` · `create-internet-gateway` · `create-security-group` |
| Sanal Sunucu | `c3q3` | EC2: key pair, instance type, Elastic IP | `ec2 create-key-pair` · `run-instances` · `describe-instances` · `allocate-address` |
| Depoya Koy | `c3q4` | S3: bucket/object, versioning, storage class | `s3 mb` · `s3 cp` · `s3api put-bucket-versioning` |
| Yönetilen Veritabanı | `c3q5` | RDS: managed DB, durum, maliyet (stop) | `rds create-db-instance` · `describe-db-instances` · `stop-db-instance` |

**Vurgular:** least privilege (IAM), public/private ayrımı (VPC), Free Tier & maliyet
refleksi (t3.micro, `rds stop-db-instance`), dayanıklılık (S3 versioning).

## Öğren → Oyna → Uygula
AWS Free Tier hesabı aç → bu modülü oyna → gerçek konsol/CLI ile küçük bir statik
site (S3) + tek EC2 + minik RDS kur, sonra hepsini kapat (maliyet). Sonraki modül:
**IaC (Terraform)** — aynı altyapıyı elle değil kodla kur.
