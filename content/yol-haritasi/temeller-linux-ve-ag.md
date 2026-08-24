---
type: stage
stage: 1
track: fundamentals
slug: temeller-linux-ve-ag
weeks: "Hafta 1-4"
hours: 10
title: "Aşama 1: Linux, ağ ve Git temelleri (hafta 1-4)"
description: "Bulutun altındaki üç temel: kabuk, ağ ve versiyon kontrolü. Dört haftada ne öğrenilir, hangi sırayla ve neyi bitirdiğinde bir sonraki aşamaya geçebilirsin."
outcome: "Bir sunucuya bağlanıp içinde iş yapabilir, bir repoyu dallandırıp PR gönderebilirsin."
project: "Bir sanal sunucuya SSH ile bağlan, üstüne bir web sunucusu kur, servisi başlat; yapılandırmayı bir Git reposunda tut ve bir dalda değiştirip PR aç."
targetQuery: "cloud engineer linux ve git temelleri"
alsoRanksFor:
  - "bulut için linux öğrenme sırası"
  - "git öğrenme yol haritası"
  - "tcp ip subnet başlangıç"
practiceQuest: c1q2
updated: 2026-08-24
---

Bu aşama atlanmaya en müsait, atlandığında en pahalıya patlayan aşama. AWS
konsolu renkli düğmelerle dolu ve davetkâr görünüyor; terminal siyah bir
ekran. Ama bulutta bir şey bozulduğunda düğmeler yardım etmiyor — bir kabuğa
bağlanıp logu okuyorsun.

Dört haftanın iki yarısı var: ilk iki hafta **makinenin içi** (Linux), sonraki
iki hafta **makineler arası** (ağ ve Git).

## Hafta 1-2 — Linux ve kabuk

Öğrenilecek şey sanıldığından az. Günlük işin neredeyse tamamı yirmi kadar
komutla dönüyor. Zor olan komut ezberlemek değil, üç soruyu refleks haline
getirmek: *neredeyim, burada ne var, bu dosyanın içinde ne yazıyor.*

Sırayla:

- **Dolaşma ve dosyalar** — dizin ağacı, kopyalama, taşıma, silme. Silmenin
  geri dönüşü olmadığını erken öğrenmek iyidir.
- **Metin** — bir dosyanın içini okumak, içinde arama yapmak, çıktıyı başka
  bir komuta bağlamak (pipe). Bu, Linux'un asıl fikri: küçük araçları
  birbirine takmak.
- **İzinler** — `permission denied` hatasının %90'ının cevabı burada.
  Ayrıntı: [chmod komutu](/komut/chmod).
- **Süreçler ve servisler** — ne çalışıyor, neden çökmüş, disk dolu mu.
- **Paketler ve ortam değişkenleri** — yazılım kurmak, gizli değerleri
  koda gömmeden vermek.

Kavramsal anlatım: [Terminal ve Linux dersi](/ogren/terminal-ve-linux).

## Hafta 3 — Ağın temeli

Bulut, kiraladığın bilgisayarların **birbiriyle konuşması** demek. Bu yüzden
ağ bilgisi opsiyonel değil. Bu haftada peşine düşeceğin sorular:

- Bir istek tarayıcıdan sunucuya nasıl gidiyor? (IP, port, DNS, HTTP/HTTPS)
- `10.0.0.0/16` ne demek? Subnet ve CIDR neden bu kadar çok karşına çıkıyor?
- Firewall neyi engelliyor, load balancer ne yapıyor?

Bunları şimdi yüzeysel anlamak yeterli — üçüncü aşamada AWS'in VPC'sini
kurarken hepsi tekrar, bu kez elinde gelecek. Ama hiç duymamış olarak VPC'ye
girersen o hafta iki kat uzuyor.

## Hafta 4 — Git

Git, kodun zaman makinesi. Ekip çalışmasının da tek dili: iş yerinde kod
göndermenin yolu dosya paylaşmak değil, **pull request**.

Öğrenilecek asgari küme: repo klonlama, değişikliği kaydetme, uzağa gönderme,
dal açma, birleştirme, çakışma çözme. Ezberlenecek yirmi komut değil, anlaşılacak
tek model var: **çalışma alanı → hazırlık alanı → depo**. Model oturduğunda
komutlar kendiliğinden anlam kazanıyor.

## Sık yapılan hata

Bu aşamada en sık görülen hata, komutları **okuyarak** öğrenmeye çalışmak.
Bir listeye bakıp "tamam, bunları biliyorum" demek kolay. Ama iki hafta sonra
bir sunucuda tek başına kaldığında parmakların hatırlamıyor.

Çözümü sıkıcı ama kesin: aynı komutları farklı bağlamlarda tekrar yazmak.
Oyunun ilk bölümü tam olarak bunun için var — komutları bir senaryo içinde,
arka arkaya, sen yazıyorsun.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Bir sunucuya bağlanıp bir servisin neden çalışmadığını tek başına araştırabiliyorsun.
- `permission denied` gördüğünde ne yapacağını biliyorsun.
- Bir repoda dal açıp değişikliğini PR olarak gönderdin.
- "Bu istek nereye gidiyor?" sorusunu kabaca çizebiliyorsun.

Bu dördü tamamsa AWS'e geçmeye hazırsın — ve artık konsoldaki düğmelerin ne
yaptığını da anlayacaksın.
