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

insert into public.fabrics (id, name, collection, category, description, texture, specs)
values
  ('atelier-velvet', 'Atelier Velvet', 'Atelier', 'Upholstery', 'A deep, softly brushed velvet with a quiet lustre for statement seating and intimate rooms.', 'tex-velvet', '{"Composition":"100% cotton","Width":"140 cm","Use":"Upholstery"}'::jsonb),
  ('heritage-linen', 'Heritage Linen', 'Heritage', 'Curtains', 'A relaxed linen with natural movement and a warm, architectural hand.', 'tex-linen', '{"Composition":"100% linen","Width":"Fully wide","Use":"Curtains"}'::jsonb),
  ('damascus-damask', 'Damascus Damask', 'Heritage', 'Upholstery', 'A tonal damask inspired by the layered geometry and depth of Damascus interiors.', 'tex-damask', '{"Composition":"52% viscose, 48% polyester","Width":"140 cm","Use":"Upholstery"}'::jsonb),
  ('cloud-cashmere', 'Cloud Cashmere', 'Quiet Luxury', 'Upholstery', 'A generous, tactile weave with the softness and restraint of a private sitting room.', 'tex-cashmere', '{"Composition":"68% wool, 32% cashmere","Width":"145 cm","Use":"Upholstery"}'::jsonb),
  ('boucle-stone', 'Boucle Stone', 'Quiet Luxury', 'Upholstery', 'A sculptural boucle that brings softness, texture and light to contemporary forms.', 'tex-boucle', '{"Composition":"74% polyester, 26% acrylic","Width":"140 cm","Use":"Upholstery"}'::jsonb),
  ('silk-afterlight', 'Silk Afterlight', 'Afterlight', 'Curtains', 'A fluid silk blend that catches the light with a subtle, evening warmth.', 'tex-silk', '{"Composition":"70% silk, 30% linen","Width":"138 cm","Use":"Curtains"}'::jsonb),
  ('mohair-meadow', 'Mohair Meadow', 'Natural Forms', 'Upholstery', 'A resilient mohair with an organic colour story for rooms that invite lingering.', 'tex-mohair', '{"Composition":"78% mohair, 22% wool","Width":"140 cm","Use":"Upholstery"}'::jsonb),
  ('ottoman-earth', 'Ottoman Earth', 'Natural Forms', 'Upholstery', 'A ribbed ottoman with a grounded, generous character suited to tailored upholstery.', 'tex-ottoman', '{"Composition":"61% cotton, 39% polyester","Width":"140 cm","Use":"Upholstery"}'::jsonb),
  ('quartz-wall', 'Quartz Wall', 'Architectural', 'Wallpaper', 'A mineral-toned wallcovering with a softly reflective surface and calm presence.', 'tex-quartz', '{"Composition":"Non-woven wallcovering","Width":"52 cm","Use":"Wallpaper"}'::jsonb),
  ('forest-room', 'Forest Room', 'Architectural', 'Wallpaper', 'A deep botanical tone that gives a room a composed, enveloping atmosphere.', 'tex-forest', '{"Composition":"Textile-backed wallcovering","Width":"68.5 cm","Use":"Wallpaper"}'::jsonb),
  ('burgundy-study', 'Burgundy Study', 'Afterlight', 'Wallpaper', 'A rich, intimate wall colour for libraries, studies and rooms with evening light.', 'tex-burgundy', '{"Composition":"Non-woven wallcovering","Width":"52 cm","Use":"Wallpaper"}'::jsonb),
  ('linen-veil', 'Linen Veil', 'Atelier', 'Curtains', 'A sheer linen layer designed to soften daylight without losing the shape of the view.', 'tex-linen', '{"Composition":"100% linen","Width":"Fully wide","Use":"Curtains"}'::jsonb)
on conflict (id) do nothing;

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
