# 🌍 IaC Müfredatı (Ch4 — Terraform)

> Kaynak: [roadmap.sh/terraform](https://roadmap.sh/terraform) — Init/Providers → HCL →
> Variables/Outputs → Format & Validate → Deployment → State Management → Modules →
> Workspaces → Clean Up sıralaması baz alındı.
> Hedef: Cloud Core'da elle açılan altyapıyı artık **kodla** (tekrar üretilebilir, versiyonlu).

IaC modülü **4 eğitim (quest)** içerir. Temel döngüden başlar, esneklik (değişken),
gerçeklik (state) ve ölçek (modül/workspace) ile derinleşir.

| Eğitim | id | Roadmap konusu | Komutlar (Terraform) |
|--------|----|----------------|----------------------|
| Genesis | `c4q1` | Init, Format & Validate, Deployment | `init` · `fmt` · `validate` · `plan` · `apply` |
| Parametrik Sistem | `c4q2` | Input Variables, tfvars, Outputs | `plan -var` · `apply -var-file` · `output` · `console` |
| Durum Haritası | `c4q3` | State, Import, Inspect/Modify | `state list` · `state show` · `import` · `apply -replace` |
| Modüler Mimari | `c4q4` | Modules, Workspaces, Clean Up | `get` · `workspace new` · `graph` · `destroy` |

**Vurgular:** "önce `plan`, sonra `apply`" refleksi; sabit değer yerine değişken;
state'in gerçekliğin kaynağı olması; test sonrası `destroy` ile maliyet kontrolü.

## Öğren → Oyna → Uygula
Terraform'u kur → bu modülü oyna → gerçek AWS'te (Cloud Core'da elle açtıklarını) küçük
bir `main.tf` ile kur, `plan`/`apply` yap, sonra `destroy` et. Sonraki modül:
**Containers (Docker & Kubernetes)** — uygulamayı paketle ve dağıt.
