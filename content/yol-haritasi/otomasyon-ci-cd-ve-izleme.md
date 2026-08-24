---
type: stage
stage: 5
track: automation
slug: otomasyon-ci-cd-ve-izleme
weeks: "Hafta 18-22"
hours: 10
title: "Aşama 5: CI/CD ve gözlemlenebilirlik (hafta 18-22)"
description: "Elle yaptığın işi otomatikleştirme ve çalışanı görünür kılma aşaması. Pipeline mantığı, GitHub Actions, log, metrik ve alarm kurmanın temelleri."
outcome: "Push'ta test edip dağıtan bir hattın ve çalışanı izleyen bir panelin olur."
project: "Bir uygulamayı push'ta test eden, imajını derleyip yayına alan bir hat kur; sonra aynı uygulamaya metrik ekleyip bir panel ve tek bir anlamlı alarm oluştur."
targetQuery: "ci cd öğrenme yol haritası"
alsoRanksFor:
  - "github actions nasıl öğrenilir"
  - "devops pipeline mantığı"
  - "log metrik trace nedir"
practiceQuest: c6q1
updated: 2026-08-24
---

Buraya kadar öğrendiğin her şeyi elle yaptın: sunucuyu sen açtın, kodu sen
kurdun, imajı sen derledin. Bu aşama o işi bir daha yapmamakla ilgili — ve
mesleğin adındaki "engineer"ın asıl karşılığı bu.

Beş hafta iki konuya bölünüyor: üç hafta **otomasyon** (işi makineye
devretmek), iki hafta **gözlemlenebilirlik** (makinenin ne yaptığını görmek).
İkisi aynı madalyonun yüzleri: otomatikleştirilen ama izlenmeyen bir sistem,
sessizce bozulan bir sistem.

## Hafta 18 — Pipeline mantığı

Araçtan önce fikir: her değişiklik aynı hattan geçiyor — **derle → test et →
dağıt**. Hattın değeri hızda değil, **tekrarlanabilirlikte**: kimin
gönderdiğinden bağımsız olarak aynı adımlar aynı sırada çalışıyor.

Bu haftanın sorusu şu: hangi adım başarısız olursa dağıtım durmalı? Cevabı
düşünmeden kurulan hatlar, bozuk kodu üretime taşıyan otomatik bir makineye
dönüşüyor.

## Hafta 19-20 — GitHub Actions

Sözlük yine küçük: **workflow** (ne zaman tetiklenir), **job** (paralel
çalışabilen iş bloğu), **step** (tek bir komut ya da hazır eylem),
**secret** (repoya yazılamayan değerler).

Kuracağın hat sırasıyla büyüyor:

1. Her push'ta testleri çalıştır.
2. Testler geçerse imajı derle ve kayıt deposuna gönder.
3. Ana dala birleşince yayına al.

Üçüncü adımda ilk kez "yetki" sorunuyla karşılaşacaksın: hattın buluta bir
şey kurabilmesi için bir kimliğe ihtiyacı var. İkinci aşamada öğrendiğin en
az yetki alışkanlığı tam burada işe yarıyor — bir hatta yönetici yetkisi
vermek, yaygın ve pahalı bir kısayol.

## Hafta 21 — Log, metrik, alarm

Gözlemlenebilirliğin üç sütunu: **log** (ne oldu), **metrik** (ne kadar,
hangi hızla), **trace** (istek hangi servislerden geçti). Üçü aynı soruya
farklı çözünürlükte cevap veriyor.

Bu haftada bir uygulamaya metrik ekliyorsun ve bir panel çiziyorsun. Panelin
işi güzel görünmek değil, **tek bakışta "iyi mi kötü mü" sorusuna cevap
vermek**. Otuz grafikli bir panel, hiç panel olmamasıyla neredeyse aynı.

## Hafta 22 — Alarm ve SLO

Alarm kurmak kolay, **doğru** alarm kurmak zor. Kötü alarm iki türlü olur: hiç
çalmaz ya da sürekli çalar. İkincisi daha tehlikeli, çünkü ekip alarmı
susturmayı öğreniyor.

Öğrenilecek fikir: alarm bir eşiğe değil, **kullanıcının hissettiği bir
bozulmaya** bağlanmalı. Sunucunun işlemcisi %90 ama herkes hizmet alıyorsa
sorun yok; işlemci %20 ama istekler zaman aşımına düşüyorsa sorun var. SLO/SLI
kavramları bu ayrımı ölçülebilir hale getiriyor.

## Bu aşamayı bitirdiğini nasıl anlarsın

- Bir push'un testten geçip yayına çıkmasını izledin — hiçbir adımı elle
  yapmadan.
- Hattın gizli değerleri repoda yazılı değil.
- Uygulamanın sağlığını gösteren tek bir panelin var.
- Kurduğun alarm, gerçek bir bozulmada çalacak; her dalgalanmada değil.
