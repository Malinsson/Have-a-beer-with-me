import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export const useUserSlug = () => {
    const [slug, setSlug] = useState(null);

    useEffect(() => {
        const fetchSlug = async () => {
            const { data: { session }} = await supabase.auth.getSession();
            const user = session?.user;

            if (!user) return;


            const { data } = await supabase
                .from("profiles")
                .select("slug_value")
                .eq("id", user.id)
                .maybeSingle();
            
            if (data) {
                setSlug(data.slug_value);
            }
        };

        fetchSlug();
    }, []);

    return slug;
};