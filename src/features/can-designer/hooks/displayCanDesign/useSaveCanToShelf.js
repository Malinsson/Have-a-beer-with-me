import { useState } from "react";
import { supabase } from "../../../../lib/supabase.js";

export const useSaveCanToShelf = () => {
    const [savingDesignId, setSavingDesignId] = useState(null);
    const [error, setError] = useState(null);

    const saveCanToShelf = async (designId) => {
        if (!designId) {
            throw new Error("Missing design id");
        }

        try {
            setSavingDesignId(designId);
            setError(null);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error("User not authenticated");

            const { data: existing, error: existingError } = await supabase
                .from("saved_designs")
                .select("id")
                .eq("user_id", session.user.id)
                .eq("design_id", designId)
                .maybeSingle();

            if (existingError) throw existingError;

            if (existing?.id) {
                return { success: true, alreadySaved: true };
            }

            const { error: insertError } = await supabase
                .from("saved_designs")
                .insert({ user_id: session.user.id, design_id: designId });

            if (insertError) throw insertError;

            return { success: true, alreadySaved: false };
        } catch (err) {
            console.error("Failed to save can to shelf:", err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setSavingDesignId(null);
        }
    };

    return { saveCanToShelf, savingDesignId, error };
};