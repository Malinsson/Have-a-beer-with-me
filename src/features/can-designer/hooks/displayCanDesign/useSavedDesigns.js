import { supabase } from "../../../../lib/supabase.js";
import { useState, useEffect } from "react";
import { getCachedValue, setCachedValue } from "../../../../lib/cache.js";

const CACHE_TTL = 5 * 60 * 1000;

export const useSavedDesigns = (userId) => {
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const cacheKey = `saved-designs:${userId}`;
    const cachedSavedDesigns = getCachedValue(cacheKey);

    if (cachedSavedDesigns) {
      setSavedDesigns(cachedSavedDesigns);
      setLoading(false);
      return () => { cancelled = true; };
    }

    const fetchSavedDesigns = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("saved_designs")
        .select(`
          id,
          created_at,
          share_id,
          designs!saved_designs_share_id_fkey (
            id,
            name,
            design_data,
            share_id,
            updated_at
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) setError(error);
      else {
        setSavedDesigns(data || []);
        setCachedValue(cacheKey, data || [], CACHE_TTL);
      }
      setLoading(false);
    };

    fetchSavedDesigns();
    return () => { cancelled = true; };
  }, [userId]);

  return { savedDesigns, loading, error };
};