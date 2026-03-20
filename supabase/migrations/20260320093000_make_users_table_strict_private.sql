alter table public.users enable row level security;
alter table public.users force row level security;

-- Remove any existing policies so the table is fully private.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
  loop
    execute format('drop policy if exists %I on public.users', p.policyname);
  end loop;
end
$$;

revoke all on table public.users from anon, authenticated;
