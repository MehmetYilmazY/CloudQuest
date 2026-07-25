# 🔐 Gerçek hesap kurulumu (Supabase) — ~5 dakika

CloudQuest artık **gerçek kullanıcı hesapları** kullanıyor: kimlik doğrulama sunucuda
yapılır, ilerleme Postgres'te saklanır ve **cihazlar arasında senkronlanır**.
Ücretsiz plan yeterli, **kredi kartı istemiyor**.

---

## 1) Supabase projesi oluştur
1. [supabase.com](https://supabase.com) → **Start your project** → GitHub ile giriş yap.
2. **New project**:
   - **Name:** `cloudquest`
   - **Database Password:** güçlü bir şifre üret ve **bir yere kaydet**
     (bunu oyunda kullanmayacaksın, sadece veritabanı yönetimi için).
   - **Region:** sana en yakın (ör. Frankfurt / `eu-central-1`).
3. Proje hazırlanana kadar ~1 dk bekle.

## 2) Veritabanı şemasını kur
1. Sol menü → **SQL Editor** → **New query**.
2. Bu repodaki [`supabase/schema.sql`](../supabase/schema.sql) dosyasının **tamamını**
   yapıştır → **Run**.
3. "Success" görmelisin. Bu şunları kurar:
   - `profiles` tablosu (ilerleme, rozetler, hikâye durumu)
   - **Row Level Security** politikaları → *her kullanıcı yalnızca kendi satırına erişir*
   - Kayıt olan her kullanıcıya otomatik profil açan trigger

## 3) Anahtarları oyuna gir
1. Sol menü → **Project Settings** → **API**.
2. Şu iki değeri kopyala:
   - **Project URL**
   - **anon / public** anahtarı  ⚠️ *`service_role` anahtarını ASLA kullanma.*
3. [`web/js/config.js`](../web/js/config.js) dosyasını aç ve doldur:
   ```js
   window.CQ_CONFIG = {
     SUPABASE_URL: "https://xxxxxxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi..."
   };
   ```
4. Kaydet → sayfayı yenile. Kayıt/giriş ekranı çalışır durumda olmalı.

---

## E-posta doğrulaması (önemli tercih)

Supabase varsayılan olarak **e-posta doğrulaması ister**. İki seçeneğin var:

**A) Açık bırak (önerilen, daha güvenli):** Kayıt sonrası kullanıcıya doğrulama maili
gider; onaylayınca giriş yapar. Oyun bunu zaten düzgün karşılıyor
("📬 E-postanı doğrula" mesajı gösterip giriş sekmesine geçer).
> Ücretsiz planda yerleşik mail servisi **saatte ~3-4 mail** ile sınırlıdır.
> Kendi kullanımın için yeter; gerçek kullanıcı alacaksan
> **Authentication → Emails → SMTP** kısmından kendi SMTP'ni bağla.

**B) Kapat (tek kişilik/test kullanımı için pratik):**
**Authentication → Sign In / Providers → Email** → *Confirm email* seçeneğini kapat.
Kayıt olur olmaz oyun açılır.

## Yayına alırken (GitHub Pages)
**Authentication → URL Configuration**:
- **Site URL:** `https://<kullanıcı-adın>.github.io/CloudQuest/`
- **Redirect URLs:** aynı adresi ekle (şifre sıfırlama linkleri buraya döner).

---

## Güvenlik: "anon key herkese görünüyor, sorun değil mi?"
**Sorun değil — tasarım böyle.** O anahtar yalnızca "bu projeye anonim istek at"
demeye yarar; yetki vermez. Gerçek koruma veritabanındaki **RLS politikalarıdır**:

```sql
create policy "profil: kendi satirini oku"
  on public.profiles for select
  using (auth.uid() = id);
```

`auth.uid()` giriş yapmış kullanıcının kimliğidir ve **sunucuda JWT'den** okunur —
tarayıcıdan taklit edilemez. Yani başkasının satırını okumaya/yazmaya çalışan istek
veritabanı seviyesinde reddedilir. Gizli tutulması gereken tek şey `service_role`
anahtarıdır; o repoda **yok** ve olmamalı.

## Sorun giderme
| Belirti | Sebep / çözüm |
|---|---|
| "Sunucu yapılandırılmamış" ekranı | `web/js/config.js` boş — 3. adımı yap |
| "Sunucuya ulaşılamadı" | URL yanlış ya da proje uykuda (panelden **Restore**) |
| "E-postanı henüz doğrulamadın" | Gelen kutusu/spam; ya da doğrulamayı kapat (B) |
| Giriş oluyor ama ilerleme kaydolmuyor | `schema.sql` çalıştırılmamış olabilir — 2. adımı tekrarla |
| Doğrulama maili gelmiyor | Ücretsiz mail limiti; SMTP bağla veya doğrulamayı kapat |

> **Not:** Ücretsiz Supabase projeleri **1 hafta hiç kullanılmazsa uykuya alınır**;
> panelden tek tıkla geri açılır (veri kaybolmaz).
