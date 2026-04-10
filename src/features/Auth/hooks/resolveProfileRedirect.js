import supabase from "../../../lib/supabase";

export const resolveProfileRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return "/login";
    }

    const { data } = await supabase
        .from("profiles")
        .select("slug_value")
        .eq("id", user.id)
        .maybeSingle();

    return `/profile/${data?.slug_value}`;
};