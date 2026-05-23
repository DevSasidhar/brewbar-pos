create extension if not exists pgcrypto;

create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, name)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers(id),
  payment_mode text not null check (payment_mode in ('CASH', 'UPI')),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  total_items integer not null check (total_items > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  item_name text not null,
  item_price numeric(10, 2) not null check (item_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

create index if not exists idx_categories_display_order on public.categories(display_order);
create index if not exists idx_menu_items_category_order on public.menu_items(category_id, display_order);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.workers enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Workers are readable" on public.workers;
create policy "Workers are readable"
  on public.workers for select
  using (true);

drop policy if exists "Categories are readable" on public.categories;
create policy "Categories are readable"
  on public.categories for select
  using (true);

drop policy if exists "Menu items are readable" on public.menu_items;
create policy "Menu items are readable"
  on public.menu_items for select
  using (true);

drop policy if exists "Orders can be created" on public.orders;
create policy "Orders can be created"
  on public.orders for insert
  with check (true);

drop policy if exists "Order items can be created" on public.order_items;
create policy "Order items can be created"
  on public.order_items for insert
  with check (true);

insert into public.workers (name, is_active)
values
  ('Vishal', true),
  ('Chandu', true)
on conflict (name) do update set is_active = excluded.is_active;

insert into public.categories (name, display_order, is_active)
values
  ('Tea', 1, true),
  ('Natural Tea', 2, true),
  ('Milk', 3, true),
  ('Hot Coffee', 4, true),
  ('Cold Coffee', 5, true),
  ('Sandwich', 6, true),
  ('Maggi & Pasta', 7, true),
  ('Shakes', 8, true),
  ('Mojito', 9, true),
  ('Momos', 10, true),
  ('Ice Cream', 11, true),
  ('Cool Drinks', 12, true),
  ('Water Bottle', 13, true)
on conflict (name) do update set
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into public.menu_items (category_id, name, price, is_available, display_order)
values
  ((select id from public.categories where name = 'Tea'), 'Tea', 20, true, 1),
  ((select id from public.categories where name = 'Tea'), 'Allam Tea', 30, true, 2),
  ((select id from public.categories where name = 'Tea'), 'Miriyalu Tea', 30, true, 3),
  ((select id from public.categories where name = 'Tea'), 'Elachi Tea', 30, true, 4),
  ((select id from public.categories where name = 'Tea'), 'Lavangalu Tea', 30, true, 5),
  ((select id from public.categories where name = 'Tea'), 'Sonti Tea', 30, true, 6),
  ((select id from public.categories where name = 'Natural Tea'), 'Black Tea', 25, true, 1),
  ((select id from public.categories where name = 'Natural Tea'), 'Lemon Tea', 30, true, 2),
  ((select id from public.categories where name = 'Natural Tea'), 'Lemon Ginger Tea', 30, true, 3),
  ((select id from public.categories where name = 'Natural Tea'), 'Green Tea', 30, true, 4),
  ((select id from public.categories where name = 'Milk'), 'Plain Milk', 25, true, 1),
  ((select id from public.categories where name = 'Milk'), 'Elachi Milk', 30, true, 2),
  ((select id from public.categories where name = 'Milk'), 'Lavangalu Milk', 30, true, 3),
  ((select id from public.categories where name = 'Milk'), 'Miriyalu Milk', 30, true, 4),
  ((select id from public.categories where name = 'Milk'), 'Sonti Milk', 30, true, 5),
  ((select id from public.categories where name = 'Milk'), 'Cinnamon Milk', 35, true, 6),
  ((select id from public.categories where name = 'Hot Coffee'), 'Coffee', 25, true, 1),
  ((select id from public.categories where name = 'Hot Coffee'), 'Black Coffee', 30, true, 2),
  ((select id from public.categories where name = 'Hot Coffee'), 'Chocolate Coffee', 35, true, 3),
  ((select id from public.categories where name = 'Hot Coffee'), 'Caramel Coffee', 35, true, 4),
  ((select id from public.categories where name = 'Hot Coffee'), 'Hazelnut Coffee', 35, true, 5),
  ((select id from public.categories where name = 'Hot Coffee'), 'Belgian Chocolate Coffee', 35, true, 6),
  ((select id from public.categories where name = 'Hot Coffee'), 'Vanilla Coffee', 35, true, 7),
  ((select id from public.categories where name = 'Hot Coffee'), 'Mocha Coffee', 35, true, 8),
  ((select id from public.categories where name = 'Cold Coffee'), 'Cold Coffee', 99, true, 1),
  ((select id from public.categories where name = 'Cold Coffee'), 'Iced Cold Coffee', 99, true, 2),
  ((select id from public.categories where name = 'Cold Coffee'), 'Hazelnut Cold Coffee', 109, true, 3),
  ((select id from public.categories where name = 'Cold Coffee'), 'Chocolate Cold Coffee', 119, true, 4),
  ((select id from public.categories where name = 'Sandwich'), 'Nutella Toast', 80, true, 1),
  ((select id from public.categories where name = 'Sandwich'), 'Veg Sandwich', 90, true, 2),
  ((select id from public.categories where name = 'Sandwich'), 'Cheese Corn Sandwich', 100, true, 3),
  ((select id from public.categories where name = 'Sandwich'), 'Paneer Sandwich', 110, true, 4),
  ((select id from public.categories where name = 'Maggi & Pasta'), 'Plain Maggi', 60, true, 1),
  ((select id from public.categories where name = 'Maggi & Pasta'), 'Veg Maggi', 70, true, 2),
  ((select id from public.categories where name = 'Maggi & Pasta'), 'Cheese Butter Maggi', 80, true, 3),
  ((select id from public.categories where name = 'Maggi & Pasta'), 'Fried Maggi', 90, true, 4),
  ((select id from public.categories where name = 'Maggi & Pasta'), 'White Cheese Pasta', 129, true, 5),
  ((select id from public.categories where name = 'Shakes'), 'Chocolate Shake', 99, true, 1),
  ((select id from public.categories where name = 'Shakes'), 'Oreo Shake', 109, true, 2),
  ((select id from public.categories where name = 'Shakes'), 'KitKat Shake', 119, true, 3),
  ((select id from public.categories where name = 'Shakes'), 'Nutella Shake', 129, true, 4),
  ((select id from public.categories where name = 'Mojito'), 'Lemon Soda', 79, true, 1),
  ((select id from public.categories where name = 'Mojito'), 'Mint Mojito', 109, true, 2),
  ((select id from public.categories where name = 'Mojito'), 'Watermelon Mojito', 119, true, 3),
  ((select id from public.categories where name = 'Mojito'), 'Blue Curacao Mojito', 129, true, 4),
  ((select id from public.categories where name = 'Momos'), 'Veg Momos', 80, true, 1),
  ((select id from public.categories where name = 'Momos'), 'Paneer Momos', 90, true, 2),
  ((select id from public.categories where name = 'Momos'), 'Chicken Momos', 100, true, 3),
  ((select id from public.categories where name = 'Ice Cream'), 'Ice Cream', 30, true, 1),
  ((select id from public.categories where name = 'Cool Drinks'), 'Thumbs Up', 20, true, 1),
  ((select id from public.categories where name = 'Cool Drinks'), 'Sprite', 20, true, 2),
  ((select id from public.categories where name = 'Water Bottle'), 'Water Bottle Small', 10, true, 1)
on conflict (category_id, name) do update set
  price = excluded.price,
  is_available = excluded.is_available,
  display_order = excluded.display_order;
