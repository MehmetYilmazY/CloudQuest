---
type: stage
stage: 3
track: iac
slug: altyapiyi-kodla-terraform
weeks: "Hafta 9-12"
hours: 10
title: "Aşama 3: altyapıyı kodla — Terraform (hafta 9-12)"
description: "Tıklayarak kurduğun altyapıyı koda çevirme aşaması. Terraform'un temel kavramları, state neden bu kadar önemli ve dört haftada nereye kadar gelinir."
outcome: "Bir altyapıyı kodla kurup yıkabilir, aynısını ikinci bir ortamda tekrar üretebilirsin."
project: "İkinci aşamada elle kurduğun altyapının tamamını Terraform ile yeniden kur, sonra tek komutla yık ve tekrar kur — çıktı birebir aynı olmalı."
targetQuery: "terraform öğrenme yol haritası"
alsoRanksFor:
  - "infrastructure as code nedir nasıl öğrenilir"
  - "terraform state nedir"
  - "iac başlangıç rehberi"
practiceQuest: c4q1
updated: 2026-08-24
---

İkinci aşamada altyapıyı tıklayarak kurdun. Bu aşamada aynı işi **yazarak**
yapıyorsun ve neden diye sorman gerekiyor — çünkü cevabı, bu mesleğin en
önemli fikirlerinden biri.

Tıklayarak kurduğun altyapının üç sorunu var: tekrar üretilemez (aynı şeyi
ikinci kez kurmaya çalış, küçük farklarla kuracaksın), gözden geçirilemez
(bir meslektaşın senin tıklamalarını inceleyemez) ve hatırlanmaz (altı ay
sonra o ayarı neden öyle yaptığını kimse bilmiyor). Kod bu üçünü de çözüyor:
versiyonlanıyor, okunuyor, tekrar çalıştırılıyor.

## Hafta 9 — Kavramlar ve ilk kaynak

Terraform'un sözlüğü küçük: **provider** (hangi buluta konuşuyor), **resource**
(kurulacak şey), **variable** (dışarıdan verilen değer), **output** (kurulum
sonrası öğrenilen değer). Döngü de dört adım: başlat, planla, uygula, yık.

Bu haftanın en önemli alışkanlığı **plan okumak**. Terraform uygulamadan önce
ne yapacağını satır satır söylüyor. Planı okumadan uygulamak, imzalamadan
sözleşme kabul etmek gibi — ve üretimde silinen bir veritabanının hikâyesi
genellikle burada başlıyor.

## Hafta 10 — Değişkenler ve tekrar kullanım

Aynı altyapıyı test ve üretim için ayrı ayrı kurmak isteyeceksin. Kopyala-
yapıştır ilk gün çalışır, üçüncü ay çöker: iki kopya birbirinden sessizce
ayrışıyor. Çözüm, farkı **parametreye** çıkarmak.

Bu hafta ayrıca kodun içine gizli değer yazmamayı öğreniyorsun. Bir şifre
repoya girdiğinde, sonradan silsen de Git geçmişinde kalıyor.

## Hafta 11 — State: en çok yanlış anlaşılan konu

Terraform, kurduğu her şeyin kaydını **state** dosyasında tutuyor. Bu dosya
altyapının hafızası: "şu kaynağı ben kurdum, kimliği şu." State bozulursa
Terraform gerçekliği kaybediyor — ya var olan bir şeyi tekrar kurmaya çalışıyor
ya da yanlış şeyi siliyor.

Öğrenilecekler: state neden **uzakta** (remote) tutulmalı, iki kişi aynı anda
uygularsa ne olur (kilitleme), bir kaynak elle değiştirilmişse ne olur
(drift), var olan bir kaynak koda nasıl alınır (import).

Bu hafta zor gelecek. Normal — state kavramı, altyapı kodunun en soyut parçası
ve genellikle ikinci karşılaşmada oturuyor.

## Hafta 12 — Modüller

Bir modül, tekrar kullanılabilir bir altyapı parçası: "bir ağ kur" ya da "bir
web sunucusu kur" tarifini bir kez yazıp her yerde çağırıyorsun. Ekip
çalışmasında altyapı kodunun büyümesi böyle yönetiliyor.

Bu haftanın sonunda ilk aşamalardaki proje geri dönüyor: ikinci aşamada elle
kurduğun her şey artık kodda duruyor. Yıkıp tekrar kurduğunda aynı sonucu
almalısın. Alıyorsan, iş görüşmesinde anlatacağın ilk gerçek hikâyeye sahipsin.

## Sık yapılan hata

Terraform öğrenirken en sık düşülen tuzak, bulut kavramlarını atlayıp doğrudan
koda geçmek. Terraform bir bulut öğretmiyor — **var olan bilgini yazıya
çeviriyor**. Neyin kurulduğunu bilmiyorsan, kurulum kodu da anlamsız bir
şablona dönüşüyor. İkinci aşamayı atladıysan geri dön; burada kaybettiğin
zaman daha fazla.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Bir altyapıyı sıfırdan kurup yıkabiliyor, sonucun aynı olduğunu görüyorsun.
- Plan çıktısını okuyup "bu kaynağı silecek" diyebiliyorsun.
- State'i neden uzakta tuttuğunu bir cümlede anlatabiliyorsun.
- Kodunda hiçbir gizli değer yazılı değil.
