import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { buildProfileSlug } from "../utils/slug";

export const useUserSlug = () => {
    const [slug, setSlug] = useState(null);

    useEffect(() => {
        const fetchSlug = async () => {
            const { data: { user }} = await supabase.auth.getUser();

            if (!user) return;

            if (user.is_anonymous) {
                setSlug("guest");
                return;
            }

            const { data } = await supabase
                .from("profiles")
                .select("first_name, last_name, slug_value")
                .eq("id", user.id)
                .single();
            
            if (data) {
                setSlug(data.slug_value || buildProfileSlug(data.first_name, data.last_name));
            }
        };

        fetchSlug();
    }, []);

    return slug;
};