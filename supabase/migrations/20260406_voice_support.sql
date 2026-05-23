-- Rachel Voice AI Support Schema
-- Run this in Supabase SQL editor or via migration

-- Calls table
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  call_sid text not null unique,
  status text default 'active'
    check (status in ('active', 'completed', 'transferred')),
  sentiment text default 'neutral'
    check (sentiment in ('positive', 'neutral', 'frustrated')),
  reason text,
  transcript text default '',
  chat_context text default '',
  transferred boolean default false,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone
);

-- Support tickets table
create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references calls(id) on delete cascade,
  summary text,
  issue_type text
    check (issue_type in ('order', 'complaint', 'product', 'account', 'transfer', 'general')),
  resolved boolean default false,
  created_at timestamp with time zone default now()
);

-- Orders table (only if not already present —
-- your store may already have an orders table, if so skip this)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_phone text,
  customer_email text,
  status text
    check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
  items jsonb default '[]',
  estimated_delivery date,
  tracking_number text,
  created_at timestamp with time zone default now()
);

-- RLS
alter table calls enable row level security;
alter table support_tickets enable row level security;

create policy "Service role full access on calls" on calls for all using (true);
create policy "Service role full access on support_tickets" on support_tickets for all using (true);
