import { supabase } from "../../../../lib/supabase.js";

export const invokeCanDetailBootstrap = async ({ shareId } = {}) => {
    if (!supabase?.functions?.invoke || !shareId) {
        return { data: null, error: null };
    }

    const { data, error } = await supabase.functions.invoke("can-detail-bootstrap", {
        body: { shareId },
    });

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};
