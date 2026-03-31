import { supabase } from "../../../../lib/supabase.js";
import { useState, useEffect } from "react";

export const useDesign = (designId) => {
    const [design, setDesign] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!designId) return;

      let cancelled = false;

      const fetchDesigns = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("designs")
          .select("*")
          .eq("user_id", designId)
          .order("created_at", { ascending: false });

        if (cancelled) return;
  
        if (error) setError(error);
        else setDesign(data);
        setLoading(false);
      };
      
      fetchDesigns();
      return () => {
        cancelled = true;
      };
    }, [userId]);
  
    return { design, loading, error };
};