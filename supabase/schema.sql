-- ShopFlow schema
--
-- Run this in the Supabase SQL editor.

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  total_cents integer not null default 0,
  status text not null default 'pending',
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on orders (customer_id);

-- Turned off so the dashboard can read the tables during development.
alter table customers disable row level security;
alter table orders disable row level security;
