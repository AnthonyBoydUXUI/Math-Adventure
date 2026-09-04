-- Run once in the Supabase SQL editor (https://supabase.com/dashboard).
-- One auth user → one profile row. RLS: a user can only read/write their own row.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);

alter table public.profiles enable row level security;

drop policy if exists "profiles_own_row" on public.profiles;
create policy "profiles_own_row"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
