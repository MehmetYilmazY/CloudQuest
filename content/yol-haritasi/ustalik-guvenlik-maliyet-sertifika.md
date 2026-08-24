---
type: stage
stage: 6
track: mastery
slug: ustalik-guvenlik-maliyet-sertifika
weeks: "Hafta 23-26"
hours: 10
title: "Aşama 6: güvenlik, maliyet ve sertifika (hafta 23-26)"
description: "Son dört hafta: yetkileri daraltma, faturayı kontrol etme, bitirme projesini toparlama ve AWS sertifikasına hazırlanma. İş başvurusuna hazır hale gelme aşaması."
outcome: "Kurduğun sistemi güvenlik ve maliyet açısından savunabilir, portföyünü gösterebilirsin."
project: "Uçtan uca bitirme projesi: kodla kurulan, konteynerize, otomatik dağıtılan ve izlenen bir uygulama — yetkileri daraltılmış, maliyeti hesaplanmış ve README'si yazılmış halde."
targetQuery: "aws sertifika hazırlık planı"
alsoRanksFor:
  - "cloud engineer portföy projesi"
  - "aws maliyet optimizasyonu temel"
  - "least privilege nedir"
practiceQuest: c8q1
updated: 2026-08-24
---

Son dört hafta yeni araç öğrenmekle geçmiyor. Bildiklerini **savunulabilir**
hale getiriyorsun: güvenli, hesaplanabilir ve anlatılabilir. İş görüşmesinde
sorulan soru "Terraform biliyor musun" değil, "bu altyapıyı neden böyle
kurdun" oluyor.

## Hafta 23 — Güvenlik

İkinci aşamada tanıştığın en az yetki fikri burada disipline dönüşüyor.
Yapacağın iş, kendi projene bir saldırganın gözüyle bakmak:

- Hangi kimlikler ihtiyacından fazla yetkiye sahip?
- Hangi şeyler internete gereksiz yere açık?
- Gizli değerler nerede duruyor — kodda mı, bir sır kasasında mı?
- Veri hem dururken hem giderken şifreli mi?

Bu bir denetim listesi değil, alışkanlık. Bulduğun her fazlalığı daraltıyorsun
ve sistemin hâlâ çalıştığını doğruluyorsun. Bir şeyi kırmadan daraltamıyorsan,
neden gerekli olduğunu öğrenmiş oluyorsun — o da bilgi.

## Hafta 24 — Maliyet

Cloud engineer'ın en az konuşulan ama en çok fark yaratan becerisi bu. Şirket
için bir mühendisin değeri, kurduğu sistem kadar kurtardığı faturayla da
ölçülüyor.

Öğrenilecekler: neyin ne kadar tuttuğunu okumak, kaynakları ihtiyaca göre
boyutlandırmak (right-sizing), kullanılmayanı bulup kapatmak, her kaynağı
etiketlemek (tagging) ki hangi maliyetin kime ait olduğu görünsün.

Kendi hesabında yapacağın egzersiz basit: faturayı aç, en büyük üç kalemi
bul, her biri için "bu gerçekten gerekli mi, daha küçüğü yeter mi" diye sor.
Bu soruyu sorabilen bir aday, görüşmede fark ediliyor.

## Hafta 25 — Bitirme projesi

Şimdiye kadar yaptığın parçaları tek bir projede birleştiriyorsun: kodla
kurulan altyapı, konteynerize uygulama, otomatik dağıtım, panel ve alarm.
Yeni bir şey eklemek zorunda değilsin — mevcut parçaların **birlikte**
çalıştığını göstermek yeterli.

En çok atlanan ve en çok işe yarayan kısım: **README**. Ne kurduğunu, hangi
kararı neden aldığını, neyi bilerek yapmadığını yazan bir metin. İşe alım
yapan insanlar kodu her zaman okumuyor; README'yi okuyorlar. Bir mimari
çizim (kutular ve oklar yeterli) bunun değerini iki katına çıkarıyor.

## Hafta 26 — Sertifika

**AWS Certified Solutions Architect – Associate** bu yolun doğal sınavı.
Sertifika tek başına iş vermiyor ama iki işi iyi yapıyor: bilgindeki
boşlukları gösteriyor ve CV'nin ilk elemeden geçmesine yardım ediyor.

Hazırlanma biçimi önemli: baştan sona kurs izlemek yerine **pratik sınav**
çöz, yanlışlarını konu konu topla, sadece o konulara dön. Altı aydır
elleriyle iş yapmış birinin eksiği genellikle dar bir alanda oluyor —
tüm müfredatı tekrar etmek zaman kaybı.

## Bundan sonra

Altı ayın sonunda "her şeyi biliyorum" hissi gelmeyecek. Gelmemesi normal;
bu alanda kimsede yok. Değişen şey başka: artık bilmediğin bir şeyle
karşılaştığında ne yapacağını biliyorsun — belgeyi okuyup denemeyi, logdan
teşhis etmeyi, küçük parçaya indirip test etmeyi.

Başvurmaya bu noktada başla, kendini "tamamen hazır" hissettiğinde değil. O
his gelmiyor; ilan gerekliliklerinin %60'ını karşılıyorsan başvuru zamanı.
Devamı için derinleşme modülleri var — ağ teşhisi, betik yazımı, Terraform
ileri konular, Kubernetes.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Projendeki her yetkinin neden gerekli olduğunu açıklayabiliyorsun.
- Kurduğun sistemin aylık maliyetini tahmin edebiliyorsun.
- GitHub'da, README'si ve mimari çizimi olan bir bitirme projen var.
- Pratik sınavlarda geçme eşiğinin üstünde puan alıyorsun.
