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
  SUPABASE_URL: "https://kajzysiauagwnpkdbvjz.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthanp5c2lhdWFnd25wa2Ridmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTc2ODQsImV4cCI6MjEwMDczMzY4NH0.CW3BcxV8ahmk7TYxlpUtsYQulHlSo2yFhdjYgSAN2ho"
};
