alter table "public"."profiles" drop column "qr_code";

alter table "public"."profiles" add constraint "profiles_first_name_check" CHECK ((length(first_name) < 25)) not valid;

alter table "public"."profiles" validate constraint "profiles_first_name_check";

alter table "public"."profiles" add constraint "profiles_last_name_check" CHECK ((length(last_name) < 25)) not valid;

alter table "public"."profiles" validate constraint "profiles_last_name_check";


