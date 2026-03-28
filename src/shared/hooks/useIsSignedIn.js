import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export const useIsSignedIn = () => {

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setIsSignedIn(!!session);
            } catch (error) {
                console.error("Error checking auth status:", error);
                setIsSignedIn(false);
            }
        };

        checkAuthStatus();
    }, []);

    return isSignedIn;
};