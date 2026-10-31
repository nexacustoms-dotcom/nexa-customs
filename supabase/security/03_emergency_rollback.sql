-- EMERGENCY ONLY: puts the database back to "open" (the old behaviour) if something breaks after step 2.
-- This removes the protection, so fix the problem and run 02_lock_down.sql again as soon as you can.

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

alter table public.site_config disable row level security;
alter table public.orders      disable row level security;

create policy nexa_media_open on storage.objects for all to anon, authenticated
  using (bucket_id = 'nexa-media') with check (bucket_id = 'nexa-media');
