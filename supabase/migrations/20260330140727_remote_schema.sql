set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_profile_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  first_name text;
  last_name text;
  slug_value text;
begin

  if new."first_name" is null or new."last_name" is null then
    return new;
  end if;

  first_name := lower(new."first_name");
  last_name := lower(new."last_name");

  first_name := replace(replace(replace(replace(replace(replace(
    first_name,
    'å', 'a'), 'ä', 'a'), 'ö', 'o'),
    'é', 'e'), 'è', 'e'), 'ü', 'u');

  last_name := replace(replace(replace(replace(replace(replace(
    last_name,
    'å', 'a'), 'ä', 'a'), 'ö', 'o'),
    'é', 'e'), 'è', 'e'), 'ü', 'u');

  slug_value := concat(first_name, '-', last_name);

  slug_value := regexp_replace(slug_value, '[^a-z0-9-]', '', 'g');

  new.slug_value := slug_value;

  return new;
end;
$function$
;


