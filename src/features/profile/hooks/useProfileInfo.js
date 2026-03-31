import { supabase } from "../../../lib/supabase.js";
import { useState, useEffect } from "react";

export const useProfileInfo = (profileId) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (!profileId) return;

        let cancelled = false;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", profileId)
                .single();

            if (cancelled) return;
        
        if (error) setError(error);
        else setProfile(data);
        setLoading(false);
      };
      
    fetchProfile();
    return () => {
        cancelled = true;
    };
    }, [profileId]);
  
    return { profile, loading, error,  };
};
