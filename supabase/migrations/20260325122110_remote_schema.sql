create extension if not exists "pg_cron" with schema "pg_catalog";

drop policy "Enable insert for authenticated users only" on "public"."designs";

drop policy "Enable insert for users based on user_id" on "public"."designs";

drop policy "Enable read access for all users" on "public"."designs";

drop policy "Enable insert for authenticated users only" on "public"."profiles";

drop policy "Enable insert for authenticated users only" on "public"."saved_designs";

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
  
  insert into public.designs (id, user_id, share_id)
  values (gen_random_uuid(), new.id, gen_random_uuid()::text);
  
  return new;
end;
$function$
;


  create policy "Users can insert own designs"
  on "public"."designs"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own designs"
  on "public"."designs"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own designs"
  on "public"."designs"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


