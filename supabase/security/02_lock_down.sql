-- STEP 2 of 2 — LOCKS THE DATABASE. Run this ONLY after:
--   (a) you created your admin user in Supabase → Authentication → Users,
--   (b) the new website code is deployed, and
--   (c) you tested that you can sign in to /admin with that email and password.
--
-- BEFORE RUNNING: replace  YOUR-ADMIN-EMAIL@example.com  below with your real admin email.
-- (If you forget, this script stops with an error and changes nothing.)

do $$
begin
  if 'YOUR-ADMIN-EMAIL@example.com' like '%@example.com' then
    raise exception 'Edit this file first: put your real admin email in place of YOUR-ADMIN-EMAIL@example.com';
  end if;
end $$;

begin;

-- Who counts as the admin: only the signed-in Supabase user with this email.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.role(), '') = 'authenticated'
     and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('YOUR-ADMIN-EMAIL@example.com');
$$;

-- Remove every older policy on these tables (the old ones left the tables open to everyone).
do $$
declare r record;
begin
  for r in select policyname, schemaname, tablename from pg_policies
           where (schemaname = 'public' and tablename in ('site_config', 'orders'))
              or (schemaname = 'storage' and tablename = 'objects')
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- SITE SETTINGS (products, prices, pages): everyone can READ, only the admin can change.
alter table public.site_config enable row level security;
create policy site_config_public_read   on public.site_config for select to anon, authenticated using (true);
create policy site_config_admin_insert  on public.site_config for insert to authenticated with check (public.is_admin());
create policy site_config_admin_update  on public.site_config for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy site_config_admin_delete  on public.site_config for delete to authenticated using (public.is_admin());

-- ORDERS (customer names, emails, addresses): anyone can PLACE an order, only the admin can read/change/delete.
alter table public.orders enable row level security;
create policy orders_public_insert  on public.orders for insert to anon, authenticated with check (true);
create policy orders_admin_select   on public.orders for select to authenticated using (public.is_admin());
create policy orders_admin_update   on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy orders_admin_delete   on public.orders for delete to authenticated using (public.is_admin());

-- FILE STORAGE (bucket nexa-media): visitors may only UPLOAD customer artwork/quote files into
-- the artwork/ and quotes/ folders (no overwrite, no listing, no delete). Only the admin can do anything else.
create policy nexa_media_public_upload on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'nexa-media' and (storage.foldername(name))[1] in ('artwork', 'quotes'));
create policy nexa_media_admin_all on storage.objects for all to authenticated
  using (bucket_id = 'nexa-media' and public.is_admin())
  with check (bucket_id = 'nexa-media' and public.is_admin());

-- Cap upload size at 25 MB per file.
update storage.buckets set file_size_limit = 26214400 where id = 'nexa-media';

commit;
