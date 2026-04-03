alter table "public"."designs" alter column "share_id" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, created_at)
  values (new.id, now());
  
  insert into public.designs (id, user_id)
  values (gen_random_uuid(), new.id);
  
  return new;
end;
$function$
;

drop trigger if exists "on_auth_user_created" on "auth"."users";

CREATE TRIGGER on_auth_user_created BEFORE INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


