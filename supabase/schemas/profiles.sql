create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  created_at timestamptz not null default now(),
  first_name text,
  last_name text,
  qr_code text,
  github_url text,
  instagram_url text,
  linkedin_url text,
  constraint profiles_id_fkey
    foreign key (id)
    references auth.users(id)
    on update cascade
    on delete cascade
);