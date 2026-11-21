-- PROOF APPROVAL — run once in Supabase → SQL Editor (after 02_lock_down.sql).
-- Creates the table behind the "Review your proof" page and the two functions that page uses.
-- Customers never read the table directly: they hold a long random link, and the functions below only
-- ever return / change the ONE proof that matches that link.

create table if not exists public.proofs (
  id            uuid primary key default gen_random_uuid(),
  token         text unique not null,
  order_number  text not null,
  customer_name text,
  customer_email text,
  file_url      text not null,
  file_name     text,
  version       int  not null default 1,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'changes_requested', 'superseded')),
  note          text,
  decided_name  text,
  decided_at    timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists proofs_order_idx on public.proofs (order_number, created_at desc);

alter table public.proofs enable row level security;
drop policy if exists proofs_admin_all on public.proofs;
create policy proofs_admin_all on public.proofs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.proofs from anon;
grant select, insert, update, delete on public.proofs to authenticated;
grant all on public.proofs to service_role;

-- What the proof page shows for a link
create or replace function public.get_proof(p_token text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'order_number',  p.order_number,
    'customer_name', p.customer_name,
    'file_url',      p.file_url,
    'file_name',     p.file_name,
    'version',       p.version,
    'status',        p.status,
    'note',          p.note,
    'decided_name',  p.decided_name,
    'decided_at',    p.decided_at,
    'sent_at',       p.created_at
  )
  from public.proofs p
  where p.token = p_token
  limit 1;
$$;

-- The customer's decision. Only works once, and only while the proof is still pending.
create or replace function public.submit_proof(p_token text, p_decision text, p_name text, p_note text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare r public.proofs;
begin
  if p_decision not in ('approved', 'changes_requested') then
    return json_build_object('ok', false, 'error', 'invalid');
  end if;
  select * into r from public.proofs where token = p_token for update;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  if r.status <> 'pending' then
    return json_build_object('ok', false, 'error', r.status);      -- already decided, or replaced by a newer proof
  end if;
  if p_decision = 'approved' and length(trim(coalesce(p_name, ''))) < 2 then
    return json_build_object('ok', false, 'error', 'name_required');
  end if;
  if p_decision = 'changes_requested' and length(trim(coalesce(p_note, ''))) < 3 then
    return json_build_object('ok', false, 'error', 'note_required');
  end if;
  update public.proofs
     set status = p_decision,
         note = left(trim(coalesce(p_note, '')), 2000),
         decided_name = left(trim(coalesce(p_name, '')), 120),
         decided_at = now()
   where id = r.id;
  return json_build_object('ok', true, 'status', p_decision, 'order_number', r.order_number,
                           'customer_name', r.customer_name, 'customer_email', r.customer_email);
end;
$$;

revoke all on function public.get_proof(text) from public;
revoke all on function public.submit_proof(text, text, text, text) from public;
grant execute on function public.get_proof(text) to anon, authenticated;
grant execute on function public.submit_proof(text, text, text, text) to anon, authenticated;
