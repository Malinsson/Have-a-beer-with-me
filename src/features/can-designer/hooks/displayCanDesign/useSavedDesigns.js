import { supabase } from "../../../../lib/supabase.js";
import { useState, useEffect } from "react";

export const useSavedDesigns = (userId) => {
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchSavedDesigns = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("saved_designs")
        .select(`
          id,
          created_at,
          designs (
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
      else setSavedDesigns(data);
      setLoading(false);
    };

    fetchSavedDesigns();
    return () => { cancelled = true; };
  }, [userId]);

  return { savedDesigns, loading, error };
};