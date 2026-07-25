/* =========================================================================
   CloudQuest — Supabase yapılandırması
   -------------------------------------------------------------------------
   BURAYI DOLDUR (2 değer). Supabase panelinde:
     Project Settings → API
       • Project URL        -> SUPABASE_URL
       • anon / public key  -> SUPABASE_ANON_KEY

   ⚠ "anon key" GİZLİ DEĞİLDİR — tarayıcıya gitmesi normaldir ve tasarım
   gereğidir. Güvenlik bu anahtardan değil, veritabanındaki Row Level
   Security (RLS) kurallarından gelir: her kullanıcı yalnızca KENDİ satırını
   okuyup yazabilir (bkz. supabase/schema.sql).
   Asla "service_role" anahtarını buraya koyma — o gizlidir, sunucuya aittir.
   ========================================================================= */

window.CQ_CONFIG = {
  SUPABASE_URL: "",       // örn: "https://abcdefghijk.supabase.co"
  SUPABASE_ANON_KEY: ""   // örn: "eyJhbGciOi..."
};
