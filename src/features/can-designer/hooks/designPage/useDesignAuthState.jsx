import { useEffect } from "react";
import supabase from "../../../../lib/supabase";

export const useDesignAuthState = ({ setCanSkipKonto }) => {
    useEffect(() => {
        if (typeof setCanSkipKonto !== "function") {
            return undefined;
        }

        let isMounted = true;

        const syncAuthState = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!isMounted) return;
            setCanSkipKonto(!!session && !session.user?.is_anonymous);
        };

        syncAuthState();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setCanSkipKonto(!!session && !session?.user?.is_anonymous);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [setCanSkipKonto]);
};

export default useDesignAuthState;



