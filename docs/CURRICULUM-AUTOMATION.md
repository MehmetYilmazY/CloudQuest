# 🔁 Automation Müfredatı (Ch6 CI/CD + Ch7 Observability)

> Kaynak: [roadmap.sh/devops](https://roadmap.sh/devops) — CI/CD Tools (GitHub Actions),
> Infrastructure Monitoring (Prometheus/Grafana), Logs Management, Observability
> (OpenTelemetry/Jaeger) bölümleri baz alındı.
> Hedef: elle deploy'u ve "gece 3 alarmlarını" bitirmek — kod kendini test/deploy etsin,
> sistem sorunu kullanıcıdan önce haber versin.

Automation modülü **4 eğitim (quest)** içerir: 2 CI/CD + 2 Observability.

| Eğitim | id | Roadmap konusu | Komutlar |
|--------|----|----------------|----------|
| Otomatik Hat | `c6q1` | CI: build → test → trigger | `mkdir .github/workflows` · `npm run build` · `npm test` · `git push` |
| Kapıdan Geçiş | `c6q2` | CD: secrets, dispatch, deploy | `gh secret set` · `gh workflow run` · `gh run watch` · `kubectl apply` |
| Görünmezi Gör | `c7q1` | 3 sütun: log, metrik, sağlık | `tail -f`/`kubectl logs` · `kubectl top` · `curl /health` |
| Alarm & İzlek | `c7q2` | Metrics/Alerts/Dashboard/Trace | `curl` PromQL · `promtool check rules` · `kubectl port-forward` (Grafana) · `curl` Jaeger |

**Vurgular:** hızlı geri bildirim (build önce), sırları koda yazmama (repo secrets),
izlenebilir deploy, gözlemlenebilirliğin 3 sütunu, proaktif alarm (kullanıcıdan önce
yakala), dağıtık tracing ile darboğaz tespiti.

## Öğren → Oyna → Uygula
Bir repoya küçük bir GitHub Actions workflow'u ekle (build+test) → `gh` CLI ile izle →
Prometheus + Grafana'yı (docker-compose/minikube) ayağa kaldır, bir alarm kuralı yaz.
Sonraki modül: **Mastery (Security & Cost)** — finale.
