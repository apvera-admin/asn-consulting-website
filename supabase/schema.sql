-- ============================================================
-- ASN Consulting — Supabase Schema
-- Run this in your Supabase SQL editor (Project → SQL Editor → New query)
-- ============================================================

-- User profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan_tier text check (plan_tier in ('individual', 'partner', 'family', 'roe')) default null,
  purchased_services text[] default null,
  submission_limit_override integer default null,
  plan_purchased_at timestamptz default null,
  stripe_customer_id text default null,
  stripe_payment_intent_id text default null,
  submissions_used integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Submission log table
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  submission_number integer not null,
  submitted_at timestamptz default now(),
  form_data jsonb
);

alter table public.submissions enable row level security;

create policy "Users can view own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

-- Auto-create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Migration: add purchased_services and submission_limit_override
-- Run this in Supabase SQL editor if the table already exists
-- ============================================================
alter table public.profiles
  add column if not exists purchased_services text[] default '{}',
  add column if not exists submission_limit_override integer default null;

-- Backfill purchased_services for existing users based on plan_tier
update public.profiles
set purchased_services = ARRAY['status_correction']
where plan_tier in ('individual', 'partner', 'family')
  and (purchased_services is null or array_length(purchased_services, 1) is null);

update public.profiles
set purchased_services = ARRAY['roe']
where plan_tier = 'roe'
  and (purchased_services is null or array_length(purchased_services, 1) is null);
