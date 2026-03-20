
alter table public.users
  add column if not exists username text unique,
  add column if not exists password text,
  add column if not exists qr_code_url text,
  add column if not exists linked_in_url text,
  add column if not exists instagram_url text,
  add column if not exists github_url text;

alter table public.users
  alter column username set not null,
  alter column password set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'name'
  ) then
    execute 'alter table public.users drop column name';
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_username_key'
      and conrelid = 'public.users'::regclass
  ) then
    execute 'alter table public.users add constraint users_username_key unique (username)';
  end if;
end
$$;