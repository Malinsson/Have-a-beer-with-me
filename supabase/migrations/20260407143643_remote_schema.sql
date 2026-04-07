alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add constraint "profiles_email_check" CHECK ((length(email) <= 50)) not valid;

alter table "public"."profiles" validate constraint "profiles_email_check";

alter table "public"."profiles" add constraint "profiles_linkedin_url_check" CHECK ((length(linkedin_url) <= 60)) not valid;

alter table "public"."profiles" validate constraint "profiles_linkedin_url_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, created_at, email)
  values (new.id, now(), new.email);
  
  insert into public.designs (id, user_id)
  values (gen_random_uuid(), new.id);
  
  return new;
end;
$function$
;


