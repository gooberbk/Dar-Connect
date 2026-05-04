-- Dar-Connect Supabase Schema & RLS Policies

-- 1. Create Profiles Table (extends Supabase Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Properties Table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price numeric not null,
  location text not null,
  images text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Reservations Table
create table public.reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  date date not null,
  id_card_url text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.reservations enable row level security;

-- Setup RLS Policies

-- Create a secure helper function to check admin role without triggering RLS
create or replace function public.is_admin()
returns boolean as $$
declare
  is_admin boolean;
begin
  select role = 'admin' into is_admin from public.profiles where id = auth.uid();
  return coalesce(is_admin, false);
end;
$$ language plpgsql security definer set search_path = public;

-- PROFILES
-- Users can read their own profile
create policy "Users can view own profile" on public.profiles
  for select using ( auth.uid() = id );
-- Admins can read all profiles
create policy "Admins can view all profiles" on public.profiles
  for select using ( public.is_admin() );
-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using ( auth.uid() = id );

-- PROPERTIES
-- Anyone can read properties
create policy "Properties are viewable by everyone" on public.properties
  for select using ( true );
-- Only admins can insert, update, or delete properties
create policy "Admins can insert properties" on public.properties
  for insert with check ( public.is_admin() );
create policy "Admins can update properties" on public.properties
  for update using ( public.is_admin() );
create policy "Admins can delete properties" on public.properties
  for delete using ( public.is_admin() );

-- RESERVATIONS
-- Users can view their own reservations
create policy "Users can view own reservations" on public.reservations
  for select using ( auth.uid() = user_id );
-- Admins can view all reservations
create policy "Admins can view all reservations" on public.reservations
  for select using ( public.is_admin() );
-- Users can insert their own reservations
create policy "Users can insert own reservations" on public.reservations
  for insert with check ( auth.uid() = user_id );
-- Users can update their own reservations (e.g., to cancel)
create policy "Users can update own reservations" on public.reservations
  for update using ( auth.uid() = user_id );
-- Admins can update any reservation
create policy "Admins can update any reservation" on public.reservations
  for update using ( public.is_admin() );

-- 4. Trigger to create a profile automatically when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To create an admin account, sign up normally, then run this in the SQL Editor:
-- update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';

-- 5. Storage for ID Cards
insert into storage.buckets (id, name, public) values ('id_cards', 'id_cards', true);

create policy "Users can upload their own ID card"
  on storage.objects for insert
  with check ( bucket_id = 'id_cards' and auth.uid() is not null );

create policy "Users can view their own ID card"
  on storage.objects for select
  using ( bucket_id = 'id_cards' );
