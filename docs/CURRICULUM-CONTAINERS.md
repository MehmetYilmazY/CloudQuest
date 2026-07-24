# 🐳 Containers Müfredatı (Ch5 — Docker + Kubernetes)

> Kaynak: [roadmap.sh/docker](https://roadmap.sh/docker) (Building Images → Running →
> Data Persistence → Registries → CLI) ve [roadmap.sh/kubernetes](https://roadmap.sh/kubernetes)
> (Pods/Deployments → Services & Networking → Config → Scaling → Rollouts → Logs).
> Hedef: uygulamayı **paketle** (Docker) ve **ölçekli/dayanıklı çalıştır** (Kubernetes).

Containers modülü **4 eğitim (quest)** içerir: 2 Docker + 2 Kubernetes.

| Eğitim | id | Roadmap konusu | Komutlar |
|--------|----|----------------|----------|
| Kutula ve Dağıt | `c5q1` | Build & Run & Compose | `docker build` · `run` · `ps` · `compose up` |
| Kalıcılık & Registry | `c5q2` | Volumes, exec, Registry (push) | `docker exec` · `volume create` · `tag` · `push` |
| Orkestra | `c5q3` | Pods, Deployments, Services | `kubectl get nodes` · `create deployment` · `get pods` · `expose` |
| İşlet & Ölçekle | `c5q4` | Scale, Config, Rollout, Debug | `kubectl scale` · `create configmap` · `rollout undo` · `logs` |

**Vurgular:** "her yerde aynı çalışır" (imaj), ephemeral fs vs volume (kalıcılık),
registry ile paylaşım (push/pull), Service ile sabit erişim + load balancing,
rolling update/rollback ile kesintisiz sürüm, `logs`/`describe` ile debug.

## Öğren → Oyna → Uygula
Docker Desktop kur → bir mini uygulamayı `Dockerfile` ile paketle, çalıştır, DockerHub'a
push et → minikube/kind ile lokal cluster'da `deployment` + `service` aç, `scale` et.
Sonraki modül: **Automation (CI/CD + Observability)**.
