-- =========================================================================
-- CloudQuest — Supabase şeması
-- Kurulum: Supabase paneli → SQL Editor → bu dosyanın TAMAMINI yapıştır → Run
-- (Tekrar çalıştırmak güvenlidir: her şey IF NOT EXISTS / CREATE OR REPLACE.)
-- =========================================================================

-- 1) Oyuncu profili: her auth kullanıcısına 1 satır.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text        not null default 'engineer',
  avatar      smallint    not null default 0,
  level       integer     not null default 1,
  xp          integer     not null default 0,
  credits     integer     not null default 100,
  rank        text        not null default 'Intern',
  completed   jsonb       not null default '[]'::jsonb,
  badges      jsonb       not null default '[]'::jsonb,
  story       jsonb       not null default '[]'::jsonb,
  free_hints  integer     not null default 0,
  updated_at  timestamptz not null default now()
);

-- 2) GÜVENLİK: Row Level Security.
--    Bu açık olmadan anon key ile herkes her satırı okur/yazar.
alter table public.profiles enable row level security;

-- Her kullanıcı YALNIZCA kendi satırını görebilir / ekleyebilir / güncelleyebilir.
-- (auth.uid() = giriş yapmış kullanıcının id'si; anonim istekte NULL olur => hiçbir satır eşleşmez.)
drop policy if exists "profil: kendi satirini oku"    on public.profiles;
drop policy if exists "profil: kendi satirini ekle"   on public.profiles;
drop policy if exists "profil: kendi satirini guncelle" on public.profiles;
drop policy if exists "profil: kendi satirini sil"    on public.profiles;

create policy "profil: kendi satirini oku"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profil: kendi satirini ekle"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profil: kendi satirini guncelle"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profil: kendi satirini sil"
  on public.profiles for delete
  using (auth.uid() = id);

-- 3) Kayıt olan her kullanıcıya otomatik boş profil oluştur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) updated_at otomatik güncellensin.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
