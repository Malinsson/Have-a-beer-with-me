import { supabase } from "../../../../lib/supabase.js";

export const invokeCanDetailBootstrap = async ({ shareId } = {}) => {
    if (!supabase?.functions?.invoke || !shareId) {
        return { data: null, error: null };
    }

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const { data, error } = await supabase.functions.invoke("can-detail-bootstrap", {
            body: {
                shareId,
                accessToken: session?.access_token || null,
            },
        });

        if (error) {
            return { data: null, error };
        }

        return { data, error: null };
    } catch (caughtError) {
        return { data: null, error: caughtError };
    }
};
