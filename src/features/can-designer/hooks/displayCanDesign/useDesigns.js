import { supabase } from "../../../../lib/supabase.js";
import { useState, useEffect } from "react";

export const useDesign = (shareId) => {
  const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!shareId) return;

      let cancelled = false;

      const fetchDesigns = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("designs")
          .select("*")
          .eq("share_id", shareId)
          .maybeSingle();

        if (cancelled) return;
  
        if (error) setError(error);
        else setDesign(data);
        setLoading(false);
      };
      
      fetchDesigns();
      return () => {
        cancelled = true;
      };
    }, [shareId]);
  
    return { design, loading, error };
};