import { supabase } from "../../../lib/supabase.js";

export const invokeProfileBootstrap = async ({ slug, includeShelf = false } = {}) => {
    if (!supabase?.functions?.invoke || !slug) {
        return { data: null, error: null };
    }

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const { data, error } = await supabase.functions.invoke("profile-bootstrap", {
            body: {
                slug,
                includeShelf,
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
