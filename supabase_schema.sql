-- ==========================================================================
-- Haash Corporation — Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================================

-- 1. Create the `leads` table
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    email text not null,
    phone text,
    company text,
    service text,
    timeline text,
    budget text,
    details text,
    source text default 'Website Form',
    status text default 'New'
);

-- 2. Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- 3. Policy: Allow public / anonymous visitors to submit contact forms & strategy bookings
create policy "Allow anonymous inserts"
on public.leads
for insert
to anon, authenticated
with check (true);

-- 4. Policy: Allow read access for leads (can be tightened to authenticated admin users)
create policy "Allow select for leads"
on public.leads
for select
to anon, authenticated
using (true);

-- 5. Policy: Allow updating status for leads
create policy "Allow update for leads"
on public.leads
for update
to anon, authenticated
using (true)
with check (true);

-- 6. Policy: Allow deleting leads
create policy "Allow delete for leads"
on public.leads
for delete
to anon, authenticated
using (true);

-- 7. Create index on created_at for fast descending queries
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ==========================================================================
-- Optional initial sample lead
-- ==========================================================================
insert into public.leads (full_name, email, phone, company, service, timeline, details, source, status)
values (
    'Suhaib Ahmed Abbasi',
    'suhaibahmed099@gmail.com',
    '+923423951603',
    'Haash Corporation',
    'CRM Systems & Automation',
    'Immediate (1–2 weeks)',
    'Welcome to Haash Corporation CRM and Lead Intelligence System.',
    'System Initialization',
    'New'
) on conflict do nothing;
