# 🎓 Mastery Müfredatı (Ch8 — Security & Cost)

> Kaynak: AWS **Well-Architected Framework** — Security ve Cost Optimization pillar'ları
> (roadmap.sh/aws'de de geçen çerçeve) + Shared Responsibility Model.
> Hedef: bir engineer'ı senior yapan iki refleks — **güvenlik** ve **maliyet** — ve oyunun finali.

Mastery modülü **3 eğitim (quest)** içerir; oyunun kapanış perdesidir.

| Eğitim | id | Well-Architected konusu | Komutlar |
|--------|----|-------------------------|----------|
| Kapıları Kilitle | `c8q1` | IAM least privilege, secrets, audit | `iam list-attached-user-policies` · `iam detach-user-policy` · `secretsmanager create-secret` · `cloudtrail create-trail` |
| Veriyi Koru | `c8q2` | Data protection (public/encryption/scan) | `s3api put-public-access-block` · `s3api put-bucket-encryption` · `trivy image` |
| Faturayı Dizginle | `c8q3` | Cost Optimization | `ce get-cost-and-usage` · `budgets create-budget` · `ec2 create-tags` · `ec2 stop-instances` |

**Vurgular:** least privilege (fazla yetkiyi sök), sırları kasada tut, her hareketi
denetle (CloudTrail), veriyi kapat+şifrele, kodu tara (Trivy/Checkov), maliyeti
raporla+sınırla+etiketle, israfı kes. Son quest = mezuniyet: **%100 job-ready**.

## Öğren → Oyna → Uygula
AWS Well-Architected Tool'u bir hesap üzerinde çalıştır → IAM Access Analyzer + bir
Budgets alarmı kur → bir imajı Trivy ile tara. Ardından **AWS SAA (Solutions Architect
Associate)** sertifikasına hazırlan — bu 8 modül onun temelini kurar.

## 🏁 Müfredat tamamlandı
6 modül · 8 bölüm · 30 quest · 115 objective. Fundamentals → Cloud Core → IaC →
Containers → Automation → Mastery. Her modül roadmap.sh / AWS Well-Architected temelli.
