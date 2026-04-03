import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";

export const useProfileByUserId = (userId) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            if (cancelled) return;

            if (fetchError) {
                setError(fetchError);
                setProfile(null);
            } else {
                setProfile(data || null);
            }

            setLoading(false);
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return { profile, loading, error };
};