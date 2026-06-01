-- ============================================================
-- FI Barbershop — Supabase Schema
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id   uuid references auth.users on delete cascade not null primary key,
  name text not null,
  role text not null default 'customer'
    check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

-- 2. SERVICES
create table if not exists public.services (
  id          uuid default gen_random_uuid() primary key,
  name        text    not null,
  description text,
  price       integer not null,
  duration    integer not null,
  tone        integer default 210,
  created_at  timestamptz not null default now()
);

-- 3. BOOKINGS
create table if not exists public.bookings (
  id          uuid default gen_random_uuid() primary key,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  service_id  uuid references public.services(id) on delete cascade not null,
  date        date not null,
  time        text not null,
  status      text not null default 'menunggu'
    check (status in ('menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles  enable row level security;
alter table public.services  enable row level security;
alter table public.bookings  enable row level security;

-- Helper function: is current user admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- PROFILES policies
create policy "users_view_own_profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SERVICES policies (public read, admin write)
create policy "anyone_view_services"
  on public.services for select
  using (true);

create policy "admin_insert_service"
  on public.services for insert
  with check (public.is_admin());

create policy "admin_update_service"
  on public.services for update
  using (public.is_admin());

create policy "admin_delete_service"
  on public.services for delete
  using (public.is_admin());

-- BOOKINGS policies
create policy "customer_view_own_bookings"
  on public.bookings for select
  using (auth.uid() = customer_id or public.is_admin());

create policy "customer_create_booking"
  on public.bookings for insert
  with check (auth.uid() = customer_id);

create policy "admin_update_booking"
  on public.bookings for update
  using (public.is_admin());

-- ============================================================
-- TRIGGER: auto-create profile on sign-up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
