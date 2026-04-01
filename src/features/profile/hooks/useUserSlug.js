import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

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
                .select("first_name, last_name")
                .eq("id", user.id)
                .single();
            
            if (data) {
                setSlug(`${data.first_name}-${data.last_name}`.toLowerCase());
            }
        };

        fetchSlug();
    }, []);

    return slug;
};