grant select, insert on table public.users to anon, authenticated;
grant usage, select on sequence public.users_id_seq to anon, authenticated;

drop policy if exists users_select_all on public.users;
create policy users_select_all
on public.users
for select
to anon, authenticated
using (true);

drop policy if exists users_insert_all on public.users;
create policy users_insert_all
on public.users
for insert
to anon, authenticated
with check (true);
