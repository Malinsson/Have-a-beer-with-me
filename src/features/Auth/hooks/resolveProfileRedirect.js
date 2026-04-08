import supabase from "../../../lib/supabase";
import { buildProfileSlug } from "../../profile/utils/slug";

export const resolveProfileRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return "/profile/guest";
    }

    const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, slug_value")
        .eq("id", user.id)
        .maybeSingle();

    const slug = data?.slug_value || buildProfileSlug(data?.first_name, data?.last_name);
    return `/profile/${slug || "guest"}`;
};