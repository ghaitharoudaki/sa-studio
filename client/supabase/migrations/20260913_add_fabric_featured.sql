alter table public.fabrics
  add column if not exists featured boolean not null default false;