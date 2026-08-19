---
type: chapter
chapter: 1
slug: terminal-ve-linux
title: "Terminal ve Linux: sıfırdan başlayanlar için giriş"
description: "Terminal nedir, neden bulut mühendisliğinin temeli? Dizinler, dosyalar, izinler ve süreçler — komutları gerçekten yazarak öğrenmen için hazırlanmış Türkçe rehber."
targetQuery: "linux terminal öğrenme"
alsoRanksFor:
  - "terminal nedir"
  - "linux komutları başlangıç"
  - "bash temel komutlar"
practiceQuest: c1q1
updated: 2026-08-19
---

Bulutta çalışan her şey — sunucular, konteynerler, pipeline'lar — sonunda bir
kabuğa komut yazmakla yönetiliyor. Grafik arayüzler sadece o komutların
üstüne çizilmiş kapaklar. Bu yüzden Cloud Engineer olma yolunun ilk adımı
AWS değil, terminal.

İyi haber: öğrenilmesi gereken şey sanıldığından az. Günlük işin %90'ı yirmi
kadar komutla dönüyor. Zor olan komutları ezberlemek değil, **nerede
olduğunu bilmek** — ve bu, birkaç saat içinde oturan bir alışkanlık.

## Terminal aslında ne yapıyor

Terminal, bilgisayara cümle kurduğun yer. Her cümlenin yapısı aynı:

```
komut  seçenekler  hedef
```

`ls -la /home` üç parçadan oluşuyor: `ls` komutu (listele), `-la` seçenekleri
(uzun biçim + gizli dosyalar), `/home` hedefi. Bütün Linux komutları bu
kalıba uyar. Yeni bir komut gördüğünde soracağın soru "bu ne yapar?" değil,
**"bunun hedefi ne, seçenekleri ne?"** olmalı.

## Üç soru, üç komut

Bir sunucuya bağlandığında ilk yapman gereken şey, bulunduğun yeri anlamak.
Üç soru sorarsın ve her birinin bir komutu vardır:

**"Neredeyim?"** → `pwd`
Print working directory. Dosya sistemi bir ağaç ve sen o ağacın bir dalındasın.
Nerede olduğunu bilmeden yazacağın her komut kör atış olur.

**"Burada ne var?"** → `ls`
Dizinin içeriğini gösterir. `ls -la` ile gizli dosyaları (nokta ile başlayanlar)
ve izinleri de görürsün — sunucularda önemli olan çoğu dosya gizlidir.

**"İçinde ne yazıyor?"** → `cat`
Dosyanın içeriğini ekrana basar. Uzun dosyalarda `less` daha rahattır;
sadece son satırlar lazımsa `tail` kullanırsın.

Bu üçü, bir sunucuda geçirdiğin ilk beş dakikanın tamamıdır. Deneyimli
mühendisin yaptığı da bundan farklı değil — sadece daha hızlı yazıyor.

## İzinler: en çok takılınan yer

Linux'ta her dosyanın üç grup için üç izni vardır: sahip, grup, diğerleri —
her biri için okuma, yazma, çalıştırma.

`ls -l` çıktısındaki `-rwxr-xr--` dizisi tam olarak bunu söylüyor:

- `rwx` → sahip okuyabilir, yazabilir, çalıştırabilir
- `r-x` → grup okuyabilir ve çalıştırabilir, yazamaz
- `r--` → diğerleri sadece okuyabilir

Yeni yazdığın bir script'i çalıştırmaya kalkıp `permission denied` alıyorsan,
sebep neredeyse her zaman aynı: dosyada çalıştırma izni yok.

```
chmod +x deploy.sh
```

`chmod` izinleri değiştirir, `+x` ise "çalıştırma iznini ekle" demektir.
Detay için: [chmod komutu](/komut/chmod).

## Süreçler ve servisler

Sunucuda bir şey çalışmıyorsa üç ihtimal var: hiç başlamamış, çökmüş, ya da
çalışıyor ama yanlış yerde dinliyor. Sırasıyla bakılır:

- `ps aux` — şu an ne çalışıyor?
- `systemctl status nginx` — servis ayakta mı, ne zaman çöktü?
- `df -h` — disk dolmuş olabilir mi? (Şaşırtıcı sıklıkta cevap: evet.)

Bu üç komut, gece 3'te gelen alarmların büyük kısmını ilk beş dakikada çözer.

## Nasıl çalışılmalı

Terminali okuyarak öğrenemezsin. Bu sayfayı bitirdiğinde bildiğin şey
komutların ne işe yaradığı olacak — ama parmakların hâlâ bilmiyor olacak.
Aradaki farkı yalnızca tekrar kapatır.

CloudQuest'in ilk bölümü tam olarak bunun için var: aynı komutları bir
senaryo içinde, arka arkaya, sen yazıyorsun. Yanlış yazarsan mentörün
düzeltiyor; üç kez takılırsan doğrusunu gösteriyor.
