# Katman 1 — Güven & Temel

Bu belge, CloudQuest'in "oynanabilir demo"dan "satılabilir ürün"e geçişindeki
ilk katmanı anlatır: **ilerleme artık sahtelenemez, cevap anahtarı tarayıcıda
değil.**

## Neden gerekliydi

Katman 1 öncesi iki açık vardı:

1. **İlerleme istemcide yazılıyordu.** `profiles` tablosunda RLS vardı ama
   politika "kullanıcı kendi satırını güncelleyebilir" diyordu. DevTools
   konsolundan `level: 99, completed: [tüm questler]` yazmak mümkündü.
2. **Cevap anahtarı tarayıcıya gidiyordu.** `content.generated.js` her
   objective'in `expect` spec'ini ve `hint` (doğru komut) metnini içeriyordu.

Ücretsiz bir oyun için sorun değil. Ama parayla satılan bir eğitim için
ölümcül: kurumsal alıcı "çalışanım gerçekten öğrendi mi?" sorusunun cevabını
satın alır. Doğrulanamayan ilerleme satılamaz.

## Mimari

```
data/curriculum.json  (TEK KAYNAK — cevaplar dahil)
        │
        │  npm run build
        ├────────────────► web/js/content.generated.js
        │                    PUBLIC: task, teach, verb
        │                    ✗ expect  ✗ hint  ✗ success
        │
        └────────────────► supabase/functions/_shared/curriculum.json
                             SECRET: her şey (sunucuda kalır)

tarayıcı ──POST──► supabase/functions/game  ──service_role──► Postgres
           komut      • expect ile eşleştirir                 profiles
                      • adımı quest_progress'ten okur         quest_progress
                      • ödülü progression.ts ile hesaplar     attempts
                      • profiles'a YALNIZCA O yazar
```

### Paylaşılan çekirdek

| Dosya | Rol |
|---|---|
| `shared/parser.ts` | Komut eşleştirme (regex değil, yapısal). **TEK KAYNAK** |
| `shared/progression.ts` | XP/level/rank/credits kuralları. **TEK KAYNAK** |
| `shared/curriculum.schema.ts` | Zod şeması — müfredatın sözleşmesi |
| `shared/curriculum.validate.ts` | Referans bütünlüğü (requires zinciri, döngü, track/beat) |

Deno, `supabase/functions` dışındaki klasörleri bundle edemediği için
`parser.ts` ve `progression.ts`'in bir **kopyası** `supabase/functions/_shared/`
altında durur. Bu kopyayı `npm run build` üretir, elle düzenlenmez; CI
(`npm run build:check`) kopyanın kaynakla aynı kaldığını doğrular.

## Neyi kim yazabilir

`supabase/schema.sql` §5 — güvenliğin kalbi **kolon bazlı GRANT**:

```sql
grant update (name, avatar, story) on public.profiles to authenticated;
```

| Alan | Kim yazar |
|---|---|
| `name`, `avatar`, `story` | İstemci (kozmetik — ödül taşımaz) |
| `level`, `xp`, `credits`, `rank`, `badges`, `completed`, `free_hints` | **Yalnızca** `game` Edge Function (service_role) |
| `quest_progress`, `attempts` | **Yalnızca** Edge Function; istemci sadece okur |

RLS "hangi **satır**", GRANT "hangi **kolon**" sorusunu yanıtlar. İkisi de gerekir.

## Çift ödül ve yarış koşulları

* **Quest ödülü** `quest_progress.completed_at` üzerinden atomik alınır:
  `update ... where completed_at is null`. İki paralel istek gelirse ödülü
  yalnızca ilki alır.
* **Profil yazması** iyimser kilitlidir: `where level=? and xp=? and credits=?`.
  Satır aradan değiştiyse yazma reddedilir ve işlem 3 kez yeniden denenir.
* **İpucu/satın alma bedeli** tahsil edilmeden cevap dönmez; bakiye kontrolü
  hem `where credits = ?` koşuluyla hem de tablo `check` kısıtıyla korunur.

## Kurulum

### 1) Veritabanı

Supabase paneli → SQL Editor → `supabase/schema.sql` dosyasının tamamını
yapıştır → Run. (Tekrar çalıştırmak güvenlidir.)

> **Mevcut kullanıcılar:** bu betik `profiles` üzerindeki eski INSERT/DELETE
> politikalarını kaldırır ve UPDATE'i üç kolona daraltır. Var olan ilerleme
> silinmez.

### 2) Edge Function

```bash
npx supabase login
npx supabase link --project-ref <PROJE_REF>
npm run build
npx supabase functions deploy game
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` Supabase
tarafından otomatik sağlanır — ayrıca tanımlamaya gerek yok.

İsteğe bağlı, önerilir (CORS'u kendi alan adına kilitler):

```bash
npx supabase secrets set CQ_ALLOWED_ORIGIN=https://senin-alan-adin.com
```

### 3) İçerik değiştiğinde

```bash
npm run build && npx supabase functions deploy game
```

`data/curriculum.json` değişince **iki taraf da** yenilenmelidir: public
bundle (tarayıcı) ve function bundle (cevaplar).

## Kaybedilen özellik: `file://` ile çift tıkla oynama

Doğrulama sunucuya taşındığı için `web/index.html`'e çift tıklayarak oynamak
artık mümkün değil — oyun bir Supabase projesi ve deploy edilmiş `game`
fonksiyonu ister. Bu **bilinçli bir takas**: sunucu doğrulaması olmadan
ilerleme sahtelenebilir, sahtelenebilir ilerleme satılamaz.

PowerShell sürümü (`cloudquest.ps1`) çevrimdışı ve yereldir; oradaki
doğrulama hâlâ istemci tarafında. Ticari yüzey web olduğu için bu bilinçli
olarak kapsam dışı bırakıldı.

## Bilinen sınır: müfredat repoda

`data/curriculum.json` cevapları içerir ve git geçmişinde durur. Depo herkese
açıksa cevaplar da açıktır. Ücretli ürüne geçmeden önce depo **private**
yapılmalı (veya içerik ayrı bir private repo'ya / içerik veritabanına
taşınmalı). Katman 2'de paywall gelirken bu adım zorunlu hale gelir.

## Doğrulama

```bash
npm run ci
```

Sırasıyla: tip kontrolü → müfredat şeması + referans bütünlüğü → parser
testleri (211 objective'in her biri kendi çözümünü geçiyor mu) → üretilen
dosyalar commit'le güncel mi.
