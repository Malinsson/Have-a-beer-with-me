import { supabase } from "../../../lib/supabase.js";

export const invokeProfileBootstrap = async ({ slug, includeShelf = false } = {}) => {
    if (!supabase?.functions?.invoke || !slug) {
        return { data: null, error: null };
    }

    const { data, error } = await supabase.functions.invoke("profile-bootstrap", {
        body: {
            slug,
            includeShelf,
        },
    });

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};
