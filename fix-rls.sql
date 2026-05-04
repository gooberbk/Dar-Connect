-- Fix infinite recursion in RLS policies

-- First, drop all existing policies that cause the issue
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can insert properties" on public.properties;
drop policy if exists "Admins can update properties" on public.properties;
drop policy if exists "Admins can delete properties" on public.properties;
drop policy if exists "Admins can view all reservations" on public.reservations;
drop policy if exists "Admins can update any reservation" on public.reservations;

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

-- Recreate the policies using the helper function

-- PROFILES
create policy "Admins can view all profiles" on public.profiles
  for select using ( public.is_admin() );

-- PROPERTIES
create policy "Admins can insert properties" on public.properties
  for insert with check ( public.is_admin() );

create policy "Admins can update properties" on public.properties
  for update using ( public.is_admin() );

create policy "Admins can delete properties" on public.properties
  for delete using ( public.is_admin() );

-- RESERVATIONS
create policy "Admins can view all reservations" on public.reservations
  for select using ( public.is_admin() );

create policy "Admins can update any reservation" on public.reservations
  for update using ( public.is_admin() );
