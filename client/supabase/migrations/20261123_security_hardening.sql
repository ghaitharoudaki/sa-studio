-- Security hardening for fabric image storage.
--
-- 1. Stop anonymous visitors from listing every file in the bucket.
--    The bucket stays public, so image URLs on the site keep working: public
--    object downloads don't go through this SELECT policy. Admins still need
--    SELECT to delete or replace files, so it is limited to them.
drop policy if exists "Fabric images are publicly readable" on storage.objects;
drop policy if exists "Admins can list fabric images" on storage.objects;
create policy "Admins can list fabric images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'fabric-images'
  and public.is_admin()
);

-- 2. Enforce the same limits as the admin form on the server: 10 MB, images only.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'fabric-images';
