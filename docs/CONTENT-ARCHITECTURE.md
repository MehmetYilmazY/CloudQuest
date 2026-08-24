# İçerik Mimarisi — eğitim katmanı

Bu belge, CloudQuest'in **yazılı eğitim** katmanının nasıl kurulduğunu ve yeni
sayfa eklerken hangi kurallara uyulacağını anlatır.

## Neden var

Oyunun içinde zaten 4.572 kelimelik öğretici metin vardı — 211 `teach` satırı,
145 quest anlatımı, 43 hikâye satırı. Sorun içeriğin yokluğu değil,
**uçucu olmasıydı**: quest sırasında bir kez görünüp kayboluyordu. Geri dönüp
bakılamıyor, aranamıyor, link verilemiyor ve en önemlisi **Google göremiyordu**.

Landing sayfası dışında indekslenebilir tek sayfa yoktu. Eğitim katmanının
asıl işi öğretmek değil (oyun zaten öğretiyor), **huninin ağzını açmak**:
"chmod ne işe yarar" diye arayan biri sayfaya düşsün, sayfanın sonunda
terminale girsin.

## İki ayrı tek kaynak

```
data/curriculum.json     OYUN     quest, objective, cevap anahtarı
content/**.md            DERS     insan tarafından yazılan uzun metin
```

Bilerek ayrı. Farklı hızlarda değişiyorlar, farklı biçimde yazılıyorlar ve
farklı gözden geçirme gerektiriyorlar. 1550 satırlık JSON'un içine paragraf
gömmek ne yazılabilir ne okunabilir olurdu.

Bağ **ID üzerinden** kuruluyor: ders sayfası `chapter: 1` der, üreteç o
bölümün quest'lerini `curriculum.json`'dan çeker. Müfredat değişince ders
sayfasındaki quest listesi kendiliğinden güncellenir.

## URL şeması

| URL | Adet | Ne |
|---|---|---|
| `/` | 1 | Landing |
| `/yol-haritasi` | 1 | Program hub'ı — 7 aşamanın takvimi |
| `/yol-haritasi/<slug>` | 7 | Aşama sayfası (`/yol-haritasi/aws-temelleri`) |
| `/ogren` | 1 | Ders hub'ı — 8 bölümün listesi |
| `/ogren/<slug>` | 8 | Bölüm dersi (`/ogren/terminal-ve-linux`) |
| `/komut` | 1 | Komut sözlüğü hub'ı |
| `/komut/<komut>` | ~59 | Tek komut sayfası (`/komut/chmod`) |

Toplam hedef: **~77 indekslenebilir sayfa.**

### Üç tür, üç soru

Üç sayfa türü var ve üçü ayrı soruyu cevaplıyor — bilerek ayrı sayfalar:

| Tür | Soru | Örnek arama |
|---|---|---|
| `stage` (`/yol-haritasi`) | "sırayla ne yapayım?" | *cloud engineer yol haritası* |
| `chapter` (`/ogren`) | "bu konu nedir?" | *linux terminal öğrenme* |
| `command` (`/komut`) | "bu komut ne yapar?" | *chmod komutu* |

Aynı sayfaya sıkıştırılsalar üçü de yarım cevap olurdu: program arayan kişi
kavram anlatımının içinde kaybolur, konu arayan kişi takvimle uğraşır.

**Aşama sayfaları kapsamlarını elle yazmaz.** Frontmatter'daki `track`,
`curriculum.json`'daki bir track'in id'si; hangi bölümleri kapsadığı ve kaç
quest/adım içerdiği oradan okunur. Müfredata bir quest eklenince aşama
sayfasındaki sayı da değişir.

Aşamaların sırası ve kimliği `shared/content.schema.ts` içindeki
`ROADMAP_SPINE`'da. Neden ayrı bir liste: hub, henüz **yazılmamış** aşamayı da
"yakında" olarak göstermeli — yoksa okuyucu programın üç aşamadan oluştuğunu
sanır. Aşama 1-6 track'lerle aynı sırada olmak zorunda; kayarsa build kırılır.

> **Quest başına sayfa YOK.** İlk planda 54 quest sayfası vardı; iptal edildi.
> Quest sayfaları bölüm sayfalarıyla aynı konuyu anlatacaktı — Google bunu
> "aynı sorguyu hedefleyen iki sayfa" olarak görür ve ikisini birden
> zayıflatır (keyword cannibalization). Quest'ler bölüm sayfası içinde
> listeleniyor.

Slug'lar Türkçe kelimelerden türetilir ama ASCII'ye indirilir
(`Terminal ve Linux` → `terminal-ve-linux`), çünkü aranan kelime Türkçe.

## Yeni sayfa nasıl eklenir

1. `content/ogren/<slug>.md`, `content/komut/<komut>.md` veya
   `content/yol-haritasi/<slug>.md` oluştur
2. Frontmatter'ı doldur (aşağıdaki alanlar)
3. `npm run build`
4. Üretilen HTML'i de commit'le (CI drift'i kontrol ediyor)

### Frontmatter alanları

```yaml
---
type: chapter | command | stage   # zorunlu — hangi şablon
chapter: 1                   # chapter'da zorunlu, command'de opsiyonel
command: chmod               # sadece command
stage: 2                     # sadece stage — 0 (hazırlık) … 6
track: cloud-core            # sadece stage — curriculum.json track id'si
weeks: "Hafta 5-8"           # sadece stage — takvimdeki yeri
hours: 10                    # sadece stage — haftalık hedef saat
outcome: "..."               # sadece stage — hub satırında görünen kazanım
project: "..."               # sadece stage — aşamanın gerçek hayat projesi
slug: terminal-ve-linux      # opsiyonel; yoksa başlıktan/komuttan türer
title: "..."                 # 8-70 karakter — <title> ve h1
description: "..."           # 70-165 karakter — meta description
targetQuery: "chmod komutu"  # BİRİNCİL arama — sayfa başına TEK
alsoRanksFor: [...]          # ikincil sorgular
relatedCommands: [ls, chown] # sadece command
practiceQuest: c1q2          # oyuna giden çağrı
updated: 2026-08-19          # sitemap lastmod
draft: false                 # true ise noindex + sitemap dışı
---
```

Şema: [`shared/content.schema.ts`](../shared/content.schema.ts). Kural ihlali
build'i kırar, tarayıcıya ulaşmaz.

## Denetim kuralları

Üreteç ([`scripts/content.ts`](../scripts/content.ts)) şunları zorlar:

**`targetQuery` tekrar edemez.** İki sayfa aynı aramayı hedeflerse Google
ikisini de zayıflatır. Anahtar kelime haritası tek yerde, frontmatter'da.

**Gövde en az 400 karakter.** `teach` satırlarını otomatik sayfaya çevirip 69
sayfa üretmek cazip görünüyor ama Google bunu "doorway page" sayar ve siteyi
komple cezalandırır. `teach` satırı sayfanın **tohumu**, kendisi değil.
Sayfa başına hedef 400-600 kelime.

**Kırık iç link olamaz.** `relatedCommands` içinde henüz yazılmamış bir
komut varsa o link basılmaz — var olmayan sayfaya link vermek hem kullanıcıyı
hem taramayı bozar.

**`practiceQuest` gerçek olmalı.** Olmayan quest'e yönlendiren sayfa build'i kırar.

**Aşamalar iskeletle tutarlı olmalı.** Bir `stage` numarası iki kez
kullanılamaz, `track` değeri `ROADMAP_SPINE`'daki karşılığıyla aynı olmak
zorunda ve iskelet `curriculum.tracks` sırasından kayamaz. Sessizce yanlış
sırayı gösteren bir program, olmayan programdan kötüdür.

### Cevap sızıntısı kuralı

Katman 1'de cevap anahtarını tarayıcıdan çıkarmıştık. Ders sayfaları herkese
açık olduğu için aynı kapının yandan açılmaması gerekiyor. Ama kural mutlak
olamaz: `chmod` sayfası `chmod +x deploy.sh` yazamayacaksa o sayfanın var olma
sebebi kalmaz — üstelik o dizi internetteki her Linux eğitiminde geçiyor.

Bu yüzden ölçülü:

| Durum | Sonuç |
|---|---|
| Sayfa, **kendi** `practiceQuest`'inin cevabını veriyor | **HATA** — okuyucuyu gönderdiğin görevin çözümü sayfada olamaz |
| Sayfa 3'ten fazla farklı quest cevabı içeriyor | **HATA** — bu ders değil, çözüm listesi |
| 1-3 denk gelme | **UYARI** — genel bilgi, geçer (build çıktısında görünür) |

## Üretim ve dağıtım

```
npm run build          # müfredat + ders sayfaları + sitemap
npm run content        # sadece ders sayfaları (hızlı yazma döngüsü)
npm run build:check    # CI: üretilen dosyalar commit'le güncel mi
```

`web/sitemap.xml` **artık elle yazılmıyor** — üreteç yazıyor. Taslak
(`draft: true`) sayfalar sitemap'e girmez ve `noindex` alır.

## Katman 2'ye ne olacak

Site Next.js'e taşındığında bu üreteç (~450 satır) çöpe gidecek. **İçerik
gitmeyecek:** markdown + frontmatter taşınabilir bir format, Next.js aynı
dosyaları okur. Atılacak olan kod, kalan ise onlarca sayfalık yazı.

Bilinçli takas: içeriği bugün yazmaya başlamak, framework kararını beklemekten
daha değerli. Yazı SEO'da olgunlaşmak için aylara ihtiyaç duyuyor — kod bir
haftada yeniden yazılır.

## Yazma sırası

0. **7 aşama sayfası** — ✅ yazıldı. Huninin en üstü: "nereden başlayacağımı
   bilmiyorum" arayan kişi buraya düşüyor, buradan derslere ve terminale
   dağılıyor.
1. **8 bölüm dersi** — bağlam katmanı. Komut sayfaları bunlara bağlanacak.
2. **En çok aranan 10-15 komut** — `chmod`, `grep`, `ssh`, `curl`, `docker`,
   `kubectl`, `terraform`, `git`… Pilot olarak ölç.
3. **Kalan komutlar** — trafik verisi hangi sayfaların işe yaradığını
   gösterdikten sonra.

Şablon olarak yazılmış üç sayfa:
[`content/ogren/terminal-ve-linux.md`](../content/ogren/terminal-ve-linux.md) ·
[`content/komut/chmod.md`](../content/komut/chmod.md) ·
[`content/yol-haritasi/aws-temelleri.md`](../content/yol-haritasi/aws-temelleri.md)

## Gerçekçi beklenti

SEO aylar alır. Yeni bir alan adının sıralamaya girmesi 3-6 ay, rekabetli
sorgularda daha uzun. Bu katman **Katman 2'nin (paywall) hemen getirisi
değil**, 6-12 ay sonrasının müşteri kazanım motoru. Bugün yazılmasının sebebi
de bu: geç başlanan tek şey zamandır.
