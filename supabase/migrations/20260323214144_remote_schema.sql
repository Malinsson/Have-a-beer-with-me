alter table "public"."profiles" drop constraint "users_email_key";

drop index if exists "public"."users_email_key";

alter table "public"."profiles" drop column "username";


