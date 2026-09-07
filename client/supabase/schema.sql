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

alter table public.fabrics drop constraint if exists fabrics_category_check;
update public.fabrics
set category = case lower(trim(category))
  when 'upholstery' then 'Upholstery'
  when 'chair' then 'Upholstery'
  when 'chairs' then 'Upholstery'
  when 'sofa' then 'Upholstery'
  when 'sofas' then 'Upholstery'
  when 'couch' then 'Upholstery'
  when 'curtain' then 'Curtains'
  when 'curtains' then 'Curtains'
  when 'wallpaper' then 'Wallpaper'
  else 'Upholstery'
end;
alter table public.fabrics add constraint fabrics_category_check
  check (category in ('Upholstery', 'Curtains', 'Wallpaper'));

alter table public.fabrics enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
  or exists (
    select 1
    from auth.users
    where id = auth.uid()
      and coalesce(raw_app_meta_data ->> 'role', '') = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Fabrics are publicly readable" on public.fabrics;
create policy "Fabrics are publicly readable"
on public.fabrics for select
to anon, authenticated
using (true);

drop policy if exists "Admins can add fabrics" on public.fabrics;
create policy "Admins can add fabrics"
on public.fabrics for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update fabrics" on public.fabrics;
create policy "Admins can update fabrics"
on public.fabrics for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete fabrics" on public.fabrics;
create policy "Admins can delete fabrics"
on public.fabrics for delete
to authenticated
using (public.is_admin());

create index if not exists fabrics_created_at_idx on public.fabrics (created_at desc);

insert into storage.buckets (id, name, public)
values ('fabric-images', 'fabric-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Fabric images are publicly readable" on storage.objects;
create policy "Fabric images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'fabric-images');

drop policy if exists "Admins can upload fabric images" on storage.objects;
create policy "Admins can upload fabric images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'fabric-images'
  and public.is_admin()
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
  and lower(coalesce(metadata ->> 'mimetype', '')) in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
);

drop policy if exists "Admins can update fabric images" on storage.objects;
create policy "Admins can update fabric images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'fabric-images'
  and public.is_admin()
)
with check (
  bucket_id = 'fabric-images'
  and public.is_admin()
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
  and lower(coalesce(metadata ->> 'mimetype', '')) in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
);

drop policy if exists "Admins can delete fabric images" on storage.objects;
create policy "Admins can delete fabric images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'fabric-images'
  and public.is_admin()
);

-- Run this after creating the admin user in Authentication > Users.
-- Replace the email with the admin account you created.
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'admin@example.com';
