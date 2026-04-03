update public.profiles
set first_name = first_name
where (slug_value is null or slug_value = '')
  and first_name is not null
  and last_name is not null;
