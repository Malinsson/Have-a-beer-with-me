import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import { getCachedValue, setCachedValue } from "../../../lib/cache.js";

const CACHE_TTL = 5 * 60 * 1000;

export const useProfileDesigns = (userId) => {
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setDesign(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const cacheKey = `profile-design:${userId}`;
        const cachedDesign = getCachedValue(cacheKey);

        if (cachedDesign) {
            setDesign(cachedDesign);
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        const fetchDesign = async () => {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("designs")
                .select("id, name, design_data, share_id, created_at, updated_at, user_id")
                .eq("user_id", userId)
                .not("design_data", "is", null)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (cancelled) return;

            if (fetchError) {
                setError(fetchError);
                setDesign(null);
            } else {
                setDesign(data || null);
                setCachedValue(cacheKey, data || null, CACHE_TTL);
            }

            setLoading(false);
        };

        fetchDesign();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return { design, loading, error };
};