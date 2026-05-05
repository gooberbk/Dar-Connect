-- Add missing identity document URL field on reservations.
alter table public.reservations
add column if not exists id_card_url text;

-- Backfill placeholder for existing rows if you prefer non-null behavior later.
-- update public.reservations set id_card_url = '' where id_card_url is null;
