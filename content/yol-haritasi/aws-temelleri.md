---
type: stage
stage: 2
track: cloud-core
slug: aws-temelleri
weeks: "Hafta 5-8"
hours: 10
title: "Aşama 2: AWS çekirdeği — IAM, VPC, EC2, S3 (hafta 5-8)"
description: "Yol haritasının en kritik dört haftası. Bir bulut sağlayıcıda derinleşme: kimlik, ağ, sunucu ve depolama. Hangi sırayla öğrenilir ve maliyet nasıl kontrol edilir."
outcome: "Kendi hesabında bir ağ kurup içine sunucu açabilir, erişimi dar yetkiyle verebilirsin."
project: "Kendi VPC'ini kur, içine bir sunucu aç, üstüne küçük bir uygulama koy, statik dosyaları nesne depolamadan sun ve yönetilen bir veritabanına bağla."
targetQuery: "aws öğrenme yol haritası"
alsoRanksFor:
  - "iam ec2 vpc s3 nereden başlanır"
  - "aws free tier ile öğrenme"
  - "bulut sağlayıcı hangisi seçilmeli"
practiceQuest: c3q1
updated: 2026-08-24
---

Bir bulut sağlayıcı seç ve **derinleş**. Üçünü yüzeysel bilen aday, birini iyi
bilen adayın yanında zayıf duruyor — çünkü kavramlar üçünde de aynı, sadece
isimleri değişiyor. AWS'i öneriyoruz: iş ilanlarında en çok geçen, belgesi en
zengin olan. Mantığı öğrendiğinde Azure ya da GCP'ye geçmek haftalar değil
günler alıyor.

Sıra tesadüfi değil. Kimlikle başlıyorsun, çünkü diğer her şey kimliğin izin
verdiği kadar var. Sonra ağı kuruyorsun, çünkü sunucu bir ağın içinde
doğuyor. Sunucudan sonra depolama, en son veritabanı.

## Hafta 5 — IAM: kim, neye, ne kadar

IAM sıkıcı görünen ama her şeyin altında duran katman. Üç kavram:
**kullanıcı** (sen), **rol** (bir makinenin ya da servisin kimliği) ve
**policy** (neye izin var).

Öğrenilecek asıl fikir teknik değil, alışkanlık: **en az yetki**. Bir şeyin
çalışması için gereken en dar izni vermek, "her şeye izin ver, sonra
daraltırım" demekten kolay — çünkü o "sonra" hiç gelmiyor.

Bu hafta ayrıca hesabını kendinden korumayı öğreniyorsun: ana hesabı günlük
işte kullanmamak, çok faktörlü doğrulamayı açmak.

## Hafta 6 — VPC: kendi ağın

Üçüncü haftada okuduğun subnet ve CIDR bilgisi burada işe dönüyor. Kendi özel
ağını çiziyorsun: hangi aralık, hangi alt ağlar, hangisi internete açık
(public), hangisi kapalı (private).

Yeni başlayanların en çok takıldığı yer burası ve sebebi hep aynı: bir sunucu
açılıyor ama ona erişilemiyor. Cevap neredeyse her zaman üç yerden birinde —
yönlendirme tablosu, internet geçidi ya da güvenlik grubu. Bu üçlüyü bir kez
kendi elinle kurduğunda hata mesajları anlaşılır hale geliyor.

## Hafta 7 — EC2 ve S3

**EC2** kiraladığın sanal sunucu. Bir imajdan doğuyor, bir anahtar çiftiyle
bağlanıyorsun, bir güvenlik grubu neyin gireceğine karar veriyor. İlk
aşamadaki Linux bilgisi tam olarak burada karşılığını veriyor: sunucuya
bağlanıp içinde iş yapmak artık yabancı değil.

**S3** ise disk değil, **nesne** deposu. Dosya sistemi gibi davranmaya
çalışırsan yanlış araç kullanmış olursun; bir kova (bucket) içine attığın
nesneler ve onlara kim erişebilir sorusu olarak düşün. Yeni başlayanların en
pahalı hatası burada yapılıyor: bir kovayı yanlışlıkla herkese açık bırakmak.

## Hafta 8 — RDS ve maliyet

Yönetilen veritabanı (RDS) neden kendi kurduğun veritabanından farklı: yedek,
yama ve yük devretme işini sağlayıcı yapıyor. Bunun bedeli var, faydası da —
hangisinin ne zaman doğru olduğunu anlamak mühendislik kararı.

Bu haftanın diğer yarısı **para**. Free Tier cömert ama sınırsız değil.
Öğrenmen gerekenler: hangi servis nasıl ücretleniyor, kapattığını sandığın
şey neden hâlâ ücret yazıyor (ayrılmış IP'ler, bağlı diskler), alarm nasıl
kurulur. Her çalışma seansının sonunda **açtığını kapatma** alışkanlığı, bu
aşamanın en değerli çıktısı olabilir.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Yeni bir sunucuya neden erişemediğini üç adımda teşhis edebiliyorsun.
- Bir servise, ihtiyacından fazlasını vermeyen bir rol tanımlayabiliyorsun.
- Hesabında ne çalıştığını ve ne kadara mal olduğunu biliyorsun.
- Kurduğun her şeyi bir daha, sıfırdan kurabilirsin.

Son madde bir sonraki aşamanın kapısı: elle yaptığın bu işi bir daha elle
yapmayacaksın.
