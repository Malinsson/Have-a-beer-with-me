import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase.js";

export const useSavedCan = (shareId) => {
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const checkIfSaved = async () => {
        if (!shareId) {
            setIsSaved(false);
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsSaved(false);
            return;
        }

        const { data, error } = await supabase
            .from("saved_designs")
            .select("id")
            .eq("user_id", user.id)
            .eq("share_id", shareId)
            .maybeSingle();

        if (error) {
            console.error("Failed to check saved can:", error);
            setIsSaved(false);
            return;
        }

        setIsSaved(!!data);
    };

    useEffect(() => {
        checkIfSaved();
    }, [shareId]);

    return { isSaved, setIsSaved, saving, setSaving, checkIfSaved };
};