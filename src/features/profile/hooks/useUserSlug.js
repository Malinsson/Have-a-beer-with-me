import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export const useUserSlug = () => {
    const [slug, setSlug] = useState(null);

    useEffect(() => {
        const fetchSlug = async () => {
            const { data: { user }} = await supabase.auth.getUser();

            if (!user) return;


            const { data } = await supabase
                .from("profiles")
                .select("slug_value")
                .eq("id", user.id)
                .single();
            
            if (data) {
                setSlug(data.slug_value);
            }
        };

        fetchSlug();
    }, []);

    return slug;
};