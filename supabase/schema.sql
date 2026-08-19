-- =========================================================================
-- CloudQuest — Supabase şeması  (Katman 1: Güven & Temel)
-- Kurulum: Supabase paneli → SQL Editor → bu dosyanın TAMAMINI yapıştır → Run
-- (Tekrar çalıştırmak güvenlidir: her şey IF NOT EXISTS / CREATE OR REPLACE.)
--
-- GÜVENLİK MODELİ (Katman 1 ile değişti — ÖNEMLİ):
--   Eskiden istemci kendi satırındaki level/xp/credits/badges alanlarını
--   doğrudan yazabiliyordu; yani konsoldan "level 99" yazmak mümkündü.
--   Artık ilerleme YALNIZCA sunucu tarafından (Edge Function `game`,
--   service_role ile) yazılır. İstemciye bırakılan tek şey kozmetik
--   alanlardır: name, avatar, story (hangi sinematiği gördü).
--
--   Bunu sağlayan mekanizma RLS politikası DEĞİL, kolon bazlı GRANT'tir:
--   RLS "hangi SATIRA" sorusunu, GRANT "hangi KOLONA" sorusunu yanıtlar.
--   İkisi birlikte gerekir.
-- =========================================================================

-- =========================================================================
-- 1) PROFİL
-- =========================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text        not null default 'engineer',
  avatar      smallint    not null default 0,
  level       integer     not null default 1,
  xp          integer     not null default 0,
  credits     integer     not null default 60,
  rank        text        not null default 'Intern ☁️',
  completed   jsonb       not null default '[]'::jsonb,
  badges      jsonb       not null default '[]'::jsonb,
  story       jsonb       not null default '[]'::jsonb,
  free_hints  integer     not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.profiles alter column credits set default 60;

-- Ekonomi negatife düşemez (sunucu hatası bile olsa veri tutarlı kalsın).
alter table public.profiles drop constraint if exists profiles_economy_sane;
alter table public.profiles add constraint profiles_economy_sane
  check (level >= 1 and xp >= 0 and credits >= 0 and free_hints >= 0);

-- =========================================================================
-- 2) İLERLEME TAKİBİ (sunucu otoritesi)
--    Oyuncunun bir quest'te KAÇINCI adımda olduğunu sunucu bilir. İstemci
--    "5. objective'i çözdüm" diyemez; sunucu sırayı kendi tutar.
-- =========================================================================
create table if not exists public.quest_progress (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  quest_id     text        not null,
  obj_index    integer     not null default 0,   -- sunucunun bildiği güncel adım
  wrong_count  integer     not null default 0,   -- ücretsiz ipucu eşiği için
  hints_used   integer     not null default 0,
  started_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  completed_at timestamptz,                      -- NULL değilse ödül verilmiştir
  primary key (user_id, quest_id)
);

-- =========================================================================
-- 3) DENEME TELEMETRİSİ
--    Her komut denemesi buraya düşer. Üç işi birden görür:
--      • anti-cheat / kötüye kullanım tespiti
--      • "oyuncular hangi adımda takılıyor" verisi (içerik iyileştirme)
--      • Katman 3'teki kurumsal raporların ham maddesi
-- =========================================================================
create table if not exists public.attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  quest_id   text        not null,
  obj_index  integer     not null,
  command    text        not null,
  ok         boolean     not null,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_time_idx on public.attempts (user_id, created_at desc);
create index if not exists attempts_quest_idx     on public.attempts (quest_id, obj_index, ok);

-- =========================================================================
-- 4) ROW LEVEL SECURITY — hangi SATIR
-- =========================================================================
alter table public.profiles       enable row level security;
alter table public.quest_progress enable row level security;
alter table public.attempts       enable row level security;

-- --- profiles -------------------------------------------------------------
drop policy if exists "profil: kendi satirini oku"      on public.profiles;
drop policy if exists "profil: kendi satirini ekle"     on public.profiles;
drop policy if exists "profil: kendi satirini guncelle" on public.profiles;
drop policy if exists "profil: kendi satirini sil"      on public.profiles;

create policy "profil: kendi satirini oku"
  on public.profiles for select
  using (auth.uid() = id);

-- Güncelleme yalnızca kendi satırında. HANGİ KOLONLARIN yazılabileceğini
-- aşağıdaki GRANT belirler (name, avatar, story).
create policy "profil: kendi satirini guncelle"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT ve DELETE politikası BİLEREK YOK:
--   * satırı handle_new_user() trigger'ı (security definer) oluşturur;
--     istemcinin kendi başlangıç değerlerini seçmesine izin verilmez.
--   * hesap silme auth.users üzerinden cascade ile olur.
--   * ilerleme sıfırlama public.reset_progress() ile olur.

-- --- quest_progress / attempts: istemci OKUR, yazamaz ---------------------
drop policy if exists "ilerleme: kendi kaydini oku" on public.quest_progress;
create policy "ilerleme: kendi kaydini oku"
  on public.quest_progress for select
  using (auth.uid() = user_id);

drop policy if exists "deneme: kendi kaydini oku" on public.attempts;
create policy "deneme: kendi kaydini oku"
  on public.attempts for select
  using (auth.uid() = user_id);
-- Bu iki tabloya INSERT/UPDATE politikası YOK: sadece Edge Function
-- (service_role, RLS'i baypas eder) yazar.

-- =========================================================================
-- 5) KOLON BAZLI GRANT — hangi KOLON
--    Katman 1'in kalbi. Bu blok olmadan RLS tek başına yetmez: kullanıcı
--    kendi satırında level/xp/credits alanlarını serbestçe yazabilirdi.
-- =========================================================================
revoke all on public.profiles       from anon, authenticated;
revoke all on public.quest_progress from anon, authenticated;
revoke all on public.attempts       from anon, authenticated;

grant select on public.profiles       to authenticated;
grant select on public.quest_progress to authenticated;
grant select on public.attempts       to authenticated;

-- Yazılabilir tek alanlar: kozmetik olanlar.
--   name   -> görünen ad
--   avatar -> seçilen avatar
--   story  -> hangi sinematik gösterildi (tekrar göstermemek için; ödül taşımaz)
-- level, xp, credits, rank, badges, completed, free_hints DIŞARIDA:
-- onları yalnızca Edge Function service_role ile yazabilir.
grant update (name, avatar, story) on public.profiles to authenticated;

-- =========================================================================
-- 6) KAYIT TRIGGER'I — her yeni kullanıcıya varsayılan profil
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 7) updated_at otomatik
-- =========================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists quest_progress_touch_updated_at on public.quest_progress;
create trigger quest_progress_touch_updated_at
  before update on public.quest_progress
  for each row execute function public.touch_updated_at();

-- =========================================================================
-- 8) İLERLEMEYİ SIFIRLA (oyundaki `reset` komutu)
--    İstemci artık kendi kolonlarını yazamadığı için sıfırlama da sunucuda.
--    security definer: fonksiyon sahibinin yetkisiyle çalışır, ama YALNIZCA
--    çağıran kullanıcının kendi satırına dokunur.
-- =========================================================================
create or replace function public.reset_progress()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $fn$
declare
  uid uuid := auth.uid();
  result public.profiles;
begin
  if uid is null then
    raise exception 'giris gerekli';
  end if;

  delete from public.quest_progress where user_id = uid;

  update public.profiles
     set level = 1, xp = 0, credits = 60, rank = 'Intern ☁️',
         completed = '[]'::jsonb, badges = '[]'::jsonb,
         story = '[]'::jsonb, free_hints = 0
   where id = uid
  returning * into result;

  return result;
end;
$fn$;

revoke all on function public.reset_progress() from public, anon;
grant execute on function public.reset_progress() to authenticated;
