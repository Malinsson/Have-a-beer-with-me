import { supabase } from "../../../lib/supabase.js";
import { useState, useEffect } from "react";
import { buildProfileSlug } from "../utils/slug";
import { getCachedValue, setCachedValue } from "../../../lib/cache.js";

const CACHE_TTL = 5 * 60 * 1000;

export const useProfileInfo = (slug) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (!slug || slug === "guest") {
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

            const { data: profiles, error: fallbackError } = await supabase
                .from("profiles")
                .select("*");

            if (cancelled) return;

            if (fallbackError) {
                setError(fallbackError);
                setLoading(false);
                return;
            }

            const matchedProfile = (profiles || []).find((profileRow) => {
                const generatedSlug = buildProfileSlug(profileRow.first_name, profileRow.last_name);
                return profileRow.slug_value === slug || generatedSlug === slug;
            });

            if (!matchedProfile) {
                setError(new Error("Profile not found"));
            } else {
                setProfile(matchedProfile);
                setCachedValue(cacheKey, matchedProfile, CACHE_TTL);
            }

            setLoading(false);
        };
      
    fetchProfile();
    return () => {
        cancelled = true;
    };
    }, [slug]);
  
    return { profile, loading, error };
};
