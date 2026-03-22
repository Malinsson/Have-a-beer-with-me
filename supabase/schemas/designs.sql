create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  user_id uuid default auth.uid() references auth.users(id) on update cascade on delete cascade,
  design_data jsonb,
  name text,
  share_id text not null unique
);