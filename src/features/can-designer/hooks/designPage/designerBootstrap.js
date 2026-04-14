import supabase from "../../../../lib/supabase";

export const invokeDesignerBootstrap = async () => {
    if (!supabase?.functions?.invoke) {
        return { data: null, error: null };
    }

    const { data, error } = await supabase.functions.invoke("designer-bootstrap");
    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};
