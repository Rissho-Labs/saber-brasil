-- Apply in the SQL editor. Public avatars, owner-only writes, 2 MB, PNG/JPEG/WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatares são públicos para leitura" on storage.objects;
drop policy if exists "Usuários enviam o próprio avatar" on storage.objects;
drop policy if exists "Usuários substituem o próprio avatar" on storage.objects;
drop policy if exists "Usuários removem o próprio avatar" on storage.objects;

create policy "Avatares são públicos para leitura"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

create policy "Usuários enviam o próprio avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuários substituem o próprio avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuários removem o próprio avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
