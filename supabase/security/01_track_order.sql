-- STEP 1 of 2 — safe to run at any time. It only ADDS a function; nothing is locked yet.
-- Lets the "Track Your Order" page look up ONE order, and only when the order number AND
-- the email both match. (After step 2, the website can no longer read the orders table directly.)

create or replace function public.track_order(p_order text, p_email text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'order_number',    o.order_number,
    'status',          o.status,
    'items',           o.items,
    'total',           o.total,
    'delivery',        o.delivery,
    'tracking_number', o.tracking_number,
    'created_at',      o.created_at,
    'customer_name',   o.customer_name
  )
  from public.orders o
  where o.order_number = trim(p_order)
    and lower(trim(o.customer_email)) = lower(trim(p_email))
  limit 1;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;
