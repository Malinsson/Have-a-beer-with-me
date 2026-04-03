alter table public.saved_designs
add column if not exists share_id text;

update public.saved_designs sd
set share_id = d.share_id
from public.designs d
where sd.design_id = d.id
  and sd.share_id is null;

alter table public.saved_designs
alter column share_id set not null;

alter table public.saved_designs
add constraint saved_designs_share_id_fkey
foreign key (share_id)
references public.designs(share_id)
on update cascade
on delete cascade;

create unique index if not exists saved_designs_user_share_unique
on public.saved_designs(user_id, share_id);
