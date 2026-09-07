create table if not exists public.fabrics (
  id text primary key,
  name text not null,
  collection text not null default '',
  category text not null default '',
  description text not null default '',
  image text not null default '',
  texture text not null default '',
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.fabrics enable row level security;

create policy "Fabrics are publicly readable"
on public.fabrics for select
to anon, authenticated
using (true);

create policy "Admins can add fabrics"
on public.fabrics for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update fabrics"
on public.fabrics for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete fabrics"
on public.fabrics for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists fabrics_created_at_idx on public.fabrics (created_at desc);

insert into storage.buckets (id, name, public)
values ('fabric-images', 'fabric-images', true)
on conflict (id) do update set public = true;

create policy "Fabric images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'fabric-images');

create policy "Admins can upload fabric images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'fabric-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can update fabric images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'fabric-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'fabric-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can delete fabric images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'fabric-images'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Run this after creating the admin user in Authentication > Users.
-- Replace the email with the admin account you created.
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'admin@example.com';
