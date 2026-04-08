drop policy if exists "Users can view own designs" on public.designs;

create policy "Anyone can view designs"
on public.designs
as permissive
for select
to public
using (true);
