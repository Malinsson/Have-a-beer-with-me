set check_function_bodies = off;

create or replace function public.handle_profile_slug()
returns trigger
language plpgsql
security definer
as $function$
declare
  first_name_value text;
  last_name_value text;
  base_slug text;
  candidate_slug text;
  suffix integer := 1;
begin
  if new.first_name is null or new.last_name is null then
    return new;
  end if;

  first_name_value := lower(new.first_name);
  last_name_value := lower(new.last_name);

  first_name_value := replace(replace(replace(replace(replace(replace(
    first_name_value,
    'å', 'a'), 'ä', 'a'), 'ö', 'o'),
    'é', 'e'), 'è', 'e'), 'ü', 'u');

  last_name_value := replace(replace(replace(replace(replace(replace(
    last_name_value,
    'å', 'a'), 'ä', 'a'), 'ö', 'o'),
    'é', 'e'), 'è', 'e'), 'ü', 'u');

  base_slug := concat(first_name_value, '-', last_name_value);
  base_slug := regexp_replace(base_slug, '[^a-z0-9-]', '', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-|-$)', '', 'g');

  if base_slug = '' then
    return new;
  end if;

  candidate_slug := base_slug;

  while exists (
    select 1
    from public.profiles p
    where p.slug_value = candidate_slug
      and p.id <> new.id
  ) loop
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix::text;
  end loop;

  new.slug_value := candidate_slug;
  return new;
end;
$function$;

-- Recompute slugs for all named profiles using the new uniqueness logic.
update public.profiles
set first_name = first_name
where first_name is not null
  and last_name is not null;

create unique index if not exists profiles_slug_value_unique
on public.profiles (slug_value)
where slug_value is not null;
