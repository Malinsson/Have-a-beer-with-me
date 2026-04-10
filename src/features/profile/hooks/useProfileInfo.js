import { supabase } from "../../../lib/supabase.js";
import { useState, useEffect } from "react";
import { getCachedValue, setCachedValue } from "../../../lib/cache.js";

const CACHE_TTL = 5 * 60 * 1000;

export const useProfileInfo = (slug) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (!slug) {
            setProfile(null);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const cacheKey = `profile-info:${slug}`;
        const cachedProfile = getCachedValue(cacheKey);

        if (cachedProfile) {
            setProfile(cachedProfile);
            setLoading(false);
            return () => {
                cancelled = true;
            };
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("slug_value", slug)
                .maybeSingle();

            if (cancelled) return;

            if (!error && data) {
                setProfile(data);
                setCachedValue(cacheKey, data, CACHE_TTL);
                setLoading(false);
                return;
            }

            setError(error || new Error("Profile not found"));

            setLoading(false);
        };
      
    fetchProfile();
    return () => {
        cancelled = true;
    };
    }, [slug]);
  
    return { profile, loading, error };
};
