-- public-media: portraits, screenshots, CV, thumbnails. Uploaded by admins, readable by URL.
-- private-media: proofs not meant for the public. Reached only through signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']),
  ('private-media', 'private-media', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

create policy admin_all_media on storage.objects for all to authenticated
  using (bucket_id in ('public-media', 'private-media') and (select public.is_admin()))
  with check (bucket_id in ('public-media', 'private-media') and (select public.is_admin()));
