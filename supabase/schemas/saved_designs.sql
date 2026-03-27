create table if not exists public.saved_designs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid(),
  design_id uuid not null,
  constraint saved_designs_user_id_fkey1
    foreign key (user_id)
    references auth.users(id)
    on update cascade
    on delete cascade,
  constraint saved_designs_design_id_fkey
    foreign key (design_id)
    references public.designs(id)
    on update cascade
    on delete cascade
);
