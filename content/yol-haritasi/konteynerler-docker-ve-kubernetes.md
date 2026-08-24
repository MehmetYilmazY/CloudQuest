---
type: stage
stage: 4
track: containers
slug: konteynerler-docker-ve-kubernetes
weeks: "Hafta 13-17"
hours: 10
title: "Aşama 4: konteynerler — Docker ve Kubernetes (hafta 13-17)"
description: "Uygulamayı paketleyip her yerde aynı şekilde çalıştırma aşaması. Docker'ın temel kavramları, imaj katmanları ve Kubernetes'e ne zaman geçilmeli."
outcome: "Bir uygulamayı imaja paketleyip çalıştırabilir, çok servisli bir yığını ayağa kaldırabilirsin."
project: "Bir uygulamayı kendi imajına paketle, veritabanıyla birlikte çok servisli olarak ayağa kaldır; sonra aynı uygulamayı yerel bir Kubernetes kümesine dağıt."
targetQuery: "docker ve kubernetes öğrenme sırası"
alsoRanksFor:
  - "docker nereden başlanır"
  - "kubernetes öğrenmeye ne zaman geçilir"
  - "konteyner nedir sanal makine farkı"
practiceQuest: c5q1
updated: 2026-08-24
---

Bu aşamanın çözdüğü sorunun adı var: "benim makinemde çalışıyordu". Konteyner,
uygulamayı çalışması için gereken her şeyle birlikte paketliyor — böylece
senin dizüstünde, meslektaşının makinesinde ve üretim sunucusunda aynı şey
çalışıyor.

Beş hafta ayrılmasının sebebi konunun zorluğu değil, iki katmanlı olması:
önce paketleme (Docker), sonra çok sayıda paketi yönetme (Kubernetes). İkisini
aynı hafta öğrenmeye çalışmak, ikisini de yarım öğrenmenin en hızlı yolu.

## Hafta 13-14 — Docker

Üç kavramı ayırt etmekle başlıyorsun: **imaj** (kalıp), **konteyner** (o
kalıptan çalışan örnek) ve **kayıt** (imajların durduğu depo). Yeni
başlayanların kafası tam burada karışıyor; ayrımı bir kez oturttuğunda geri
kalanı kolay.

Sonra kendi imajını yazıyorsun. Öğrenilecek asıl şey sözdizimi değil,
**katman** fikri: imaj üst üste binen katmanlardan oluşuyor ve her katman
önbelleğe alınıyor. Katmanların sırasını doğru kurduğunda dakikalar süren
derleme saniyelere iniyor — bu, ileride pipeline'ının hızını belirleyen bilgi.

Bu iki haftada ayrıca öğreniyorsun: veri konteyner içinde tutulmaz (konteyner
ölünce veri de ölüyor), konteynerler birbirine ağ üzerinden konuşuyor,
ve gizli değerler imaja gömülmez.

## Hafta 15 — Çok servisli yığın

Gerçek uygulamalar tek parça değil: bir uygulama, bir veritabanı, belki bir
önbellek. Bunları tek bir tanım dosyasıyla birlikte ayağa kaldırmak, yerel
geliştirmenin standardı. Bu haftanın sonunda tek komutla açılıp kapanan bir
yığının olacak.

Burada durup soluklanmanı öneririz. Çoğu junior pozisyonun beklediği
konteyner bilgisi tam olarak bu noktada bitiyor. Kubernetes bir üst basamak —
ve gerekliliği duruma bağlı.

## Hafta 16-17 — Kubernetes

Kubernetes, "yüzlerce konteyneri kim, nerede, kaç kopya çalıştıracak"
sorusunun cevabı. Karmaşık görünüyor çünkü karmaşık; ama öğrenmesi
gereken çekirdek küme küçük:

- **Pod** — çalışan en küçük birim.
- **Deployment** — kaç kopya, hangi imaj, güncelleme nasıl yapılacak.
- **Service** — bu podlara nasıl ulaşılır (podlar gelip gidiyor, adresleri
  kalıcı değil).
- **ConfigMap / Secret** — yapılandırma ve gizli değerler.
- **Ingress** — dışarıdan gelen trafiğin kapısı.

Bunları bulutta değil, **yerelde** öğren (kind ya da minikube). Yönetilen bir
küme öğrenirken ayda ciddi para yazıyor ve yerel küme aynı kavramları
öğretiyor.

## Sık yapılan hata

En yaygın hata, Docker'ı atlayıp doğrudan Kubernetes'e girmek. İş
ilanlarında Kubernetes daha çok geçiyor, dolayısıyla cazip. Ama Kubernetes
konteyner çalıştıran bir sistem — konteynerin ne olduğunu bilmeden onu
yönetmeyi öğrenmek, direksiyonu tanımadan trafiği öğrenmeye benziyor.

İkinci yaygın hata: her şeyi Kubernetes'e taşımak. Küçük bir uygulama için
Kubernetes, taşıdığı karmaşıklıkla getirdiği faydadan fazlasını götürüyor.
"Buna gerek var mı" sorusunu sorabilmek de bu aşamanın çıktısı.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Bir uygulamayı kendi imajına paketleyip çalıştırdın.
- İmajını neden daha küçük ve daha hızlı yapabildiğini açıklayabiliyorsun.
- Çok servisli bir yığını tek tanımla ayağa kaldırıyorsun.
- Yerel bir kümede çalışan bir uygulamaya tarayıcıdan erişebildin.
