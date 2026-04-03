set check_function_bodies = off;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
before insert or update on public.profiles
for each row execute function public.handle_profile_slug();
