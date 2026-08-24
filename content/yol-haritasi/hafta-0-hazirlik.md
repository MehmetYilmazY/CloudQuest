---
type: stage
stage: 0
slug: hafta-0-hazirlik
weeks: "Hafta 0"
hours: 6
title: "Hafta 0: hiç terminal görmediysen buradan başla"
description: "Cloud Engineer olmaya karar verdin ama nereden başlayacağını bilmiyorsun. Bu aşamada kurulumu, hesapları ve çalışma ritmini bir hafta içinde oturtuyorsun."
outcome: "Çalışan bir Linux kabuğun, bir GitHub hesabın ve haftalık bir programın olur."
project: "Kendi bilgisayarında bir Linux kabuğu aç, içinde bir klasör yapısı kur, ilk repoyu GitHub'a gönder ve altı aylık takvimi kendi ajandana yaz."
targetQuery: "cloud engineer nasıl başlanır"
alsoRanksFor:
  - "sıfırdan cloud engineer olmak"
  - "wsl kurulumu başlangıç"
  - "bulut mühendisliği nereden başlanır"
practiceQuest: c1q1
updated: 2026-08-24
---

Çoğu insan bu yolda ilk haftada değil, ilk günde kaybediyor. Sebep zorluk
değil: karar yorgunluğu. "Hangi bulut sağlayıcı?", "Linux mu kurayım?",
"Python mu Go mu?" — henüz hiçbirini kullanmamışken cevaplaması imkânsız
sorular. Hafta 0 bunları senin yerine kapatıyor.

Bu aşamada hiçbir bulut kavramı öğrenmiyorsun. Tek işin, sonraki altı ay
boyunca kullanacağın **çalışma ortamını** kurmak. Bir marangozun ilk günü
masayı kurmakla geçer; ahşabı ikinci gün keser.

## Bir kabuk edin

Cloud engineering Linux üzerinde yaşıyor. Windows kullanıyorsan Linux'a
geçmene gerek yok — **WSL** (Windows Subsystem for Linux) Windows'un içine
gerçek bir Ubuntu kuruyor. Microsoft Store'dan Ubuntu'yu kur, aç, kullanıcı
adı ve şifre belirle. Bitti. macOS kullanıyorsan zaten bir Unix kabuğun var,
Terminal'i açman yeterli.

Kurulumun çalıştığını nasıl anlarsın: kabuğa `pwd` yazdığında bir dizin yolu
görüyorsan ortam hazır. Bu, altı ay boyunca binlerce kez yazacağın komutların
ilki.

## Üç hesap aç

- **GitHub** — kodun ve portföyün burada yaşayacak. İş görüşmesinde CV'den
  önce bakılan yer bu. Kullanıcı adını gerçek adına yakın seç; altı ay sonra
  bunu paylaşacaksın.
- **AWS Free Tier** — kredi kartı istiyor ama ilk 12 ay ücretsiz kotası var.
  Hesabı açtığın ilk gün **fatura alarmı** kur (5 dolarlık bir eşik yeterli).
  Bu adımı atlayanların hikâyesi hep aynı: ay sonunda beklenmeyen bir fatura.
- **Bir not defteri** — Obsidian, Notion ya da düz metin dosyaları. Öğrendiğin
  her şeyi yazacaksın; unutmamak için değil, ne öğrendiğini görmek için.

## Programı takvime yaz

Altı aylık plan bir niyet değil, bir randevu olmalı. Haftada ~10 saati şimdi
takvimine yerleştir: hangi günler, hangi saatler. Boş bulduğun zamana
çalışmayı planlarsan çalışmazsın — boş zaman her zaman başka bir şeyle
doluyor.

Önerilen bölünme:

| Ne | Süre | Neden |
|---|---|---|
| Okuma / izleme | ~2 saat | Kavramı anlamak |
| Terminalde tekrar | ~3 saat | Parmakların da öğrenmesi için |
| Gerçek bir şey kurmak | ~5 saat | Bildiğini sanmakla bilmek arasındaki fark |

Oranın tersine dönmemesine dikkat et. Video izlemek öğrenmek gibi hissettirir
ama hissettirmekle bırakır: ertesi gün klavyenin başında hiçbir şey
hatırlamazsın.

## İngilizce hakkında

Bu alanın belgeleri İngilizce. Akıcı konuşman gerekmiyor, **okuyabilmen**
gerekiyor — ve teknik İngilizce, günlük İngilizceden çok daha küçük bir kelime
kümesi kullanıyor. Bir hata mesajını Google'a yapıştırıp sonucu okuyabiliyorsan
yeterli seviyedesin. Geri kalanı yol boyunca oturuyor.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Kabuğu açıp bulunduğun dizini görebiliyorsun.
- GitHub'a boş bir repo açtın ve içine bir dosya koydun.
- AWS hesabında fatura alarmı kurulu.
- Takviminde önümüzdeki dört haftanın çalışma blokları yazılı.

Dördü tamamsa hazırlık bitti. Sıradaki aşamada asıl işe — terminale —
giriyorsun.
