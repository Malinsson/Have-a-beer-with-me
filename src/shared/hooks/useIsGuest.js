import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";

export const useIsGuest = () => {
    const [isGuest, setIsGuest] = useState(false);


    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();                
                const isGuest = session?.user?.is_anonymous ?? false;
                setIsGuest(!!session && isGuest);
            } catch (error) {
                console.error("Error checking auth status:", error);
                setIsGuest(false);
            }
        };

        checkAuthStatus();
    }, []);

    return isGuest;
}