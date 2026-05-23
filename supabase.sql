create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  product_name text not null default 'Oversized White T-Shirt',
  product_color text,
  product_slug text,
  offer text not null,
  size text not null,
  quantity integer not null default 1 check (quantity > 0),
  estimated_total integer,
  notes text,
  payment_method text not null default 'Cash on Delivery',
  status text not null default 'new',
  created_at timestamp with time zone default now()
);

alter table public.orders
  add column if not exists product_name text not null default 'Oversized White T-Shirt',
  add column if not exists product_color text,
  add column if not exists product_slug text,
  add column if not exists estimated_total integer;

update public.orders
set product_name = 'Oversized White T-Shirt'
where product_name is null or product_name = '';

alter table public.orders
  alter column product_name set default 'Oversized White T-Shirt',
  alter column product_name set not null;

alter table public.orders enable row level security;

grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;

drop policy if exists "Allow public order inserts" on public.orders;
create policy "Allow public order inserts"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow admin read orders" on public.orders;
create policy "Allow admin read orders"
on public.orders
for select
to authenticated
using (auth.email() = 'zidateothmane1@gmail.com');

drop policy if exists "Allow admin update orders" on public.orders;
create policy "Allow admin update orders"
on public.orders
for update
to authenticated
using (auth.email() = 'zidateothmane1@gmail.com')
with check (auth.email() = 'zidateothmane1@gmail.com');

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  page_title text,
  referrer text,
  user_agent text,
  visitor_id text,
  session_id text,
  created_at timestamp with time zone default now()
);

alter table public.page_views enable row level security;

grant insert on public.page_views to anon, authenticated;
grant select on public.page_views to authenticated;

drop policy if exists "Allow public page view inserts" on public.page_views;
create policy "Allow public page view inserts"
on public.page_views
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow admin read page views" on public.page_views;
create policy "Allow admin read page views"
on public.page_views
for select
to authenticated
using (auth.email() = 'zidateothmane1@gmail.com');
