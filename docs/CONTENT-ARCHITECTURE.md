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
| `/ogren` | 1 | Ders hub'ı — 8 bölümün listesi |
| `/ogren/<slug>` | 8 | Bölüm dersi (`/ogren/terminal-ve-linux`) |
| `/komut` | 1 | Komut sözlüğü hub'ı |
| `/komut/<komut>` | ~59 | Tek komut sayfası (`/komut/chmod`) |

Toplam hedef: **~69 indekslenebilir sayfa.**

> **Quest başına sayfa YOK.** İlk planda 54 quest sayfası vardı; iptal edildi.
> Quest sayfaları bölüm sayfalarıyla aynı konuyu anlatacaktı — Google bunu
> "aynı sorguyu hedefleyen iki sayfa" olarak görür ve ikisini birden
> zayıflatır (keyword cannibalization). Quest'ler bölüm sayfası içinde
> listeleniyor.

Slug'lar Türkçe kelimelerden türetilir ama ASCII'ye indirilir
(`Terminal ve Linux` → `terminal-ve-linux`), çünkü aranan kelime Türkçe.

## Yeni sayfa nasıl eklenir

1. `content/ogren/<slug>.md` veya `content/komut/<komut>.md` oluştur
2. Frontmatter'ı doldur (aşağıdaki alanlar)
3. `npm run build`
4. Üretilen HTML'i de commit'le (CI drift'i kontrol ediyor)

### Frontmatter alanları

```yaml
---
type: chapter | command      # zorunlu — hangi şablon
chapter: 1                   # chapter'da zorunlu, command'de opsiyonel
command: chmod               # sadece command
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

1. **8 bölüm dersi** — bağlam katmanı. Komut sayfaları bunlara bağlanacak.
2. **En çok aranan 10-15 komut** — `chmod`, `grep`, `ssh`, `curl`, `docker`,
   `kubectl`, `terraform`, `git`… Pilot olarak ölç.
3. **Kalan komutlar** — trafik verisi hangi sayfaların işe yaradığını
   gösterdikten sonra.

Şablon olarak yazılmış iki sayfa:
[`content/ogren/terminal-ve-linux.md`](../content/ogren/terminal-ve-linux.md) ·
[`content/komut/chmod.md`](../content/komut/chmod.md)

## Gerçekçi beklenti

SEO aylar alır. Yeni bir alan adının sıralamaya girmesi 3-6 ay, rekabetli
sorgularda daha uzun. Bu katman **Katman 2'nin (paywall) hemen getirisi
değil**, 6-12 ay sonrasının müşteri kazanım motoru. Bugün yazılmasının sebebi
de bu: geç başlanan tek şey zamandır.
