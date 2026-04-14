import { useEffect } from "react";
import supabase from "../../../../lib/supabase";
import { invokeDesignerBootstrap } from "./designerBootstrap";

export const useDesignAuthState = ({ setCanSkipKonto }) => {
    useEffect(() => {
        if (typeof setCanSkipKonto !== "function") {
            return undefined;
        }

        let isMounted = true;

        const syncAuthState = async () => {
            const { data, error } = await invokeDesignerBootstrap();
            const bootstrapCanSkip = data?.auth?.canSkipKonto;

            if (!error && typeof bootstrapCanSkip === "boolean") {
                if (!isMounted) return;
                setCanSkipKonto(bootstrapCanSkip);
                return;
            }

            if (!supabase?.auth) {
                if (!isMounted) return;
                setCanSkipKonto(false);
                return;
            }

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!isMounted) return;
            setCanSkipKonto(!!session && !session.user?.is_anonymous);
        };

        syncAuthState();

        if (!supabase?.auth) {
            return () => {
                isMounted = false;
            };
        }

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



