import supabase from "../../../lib/supabase";
import { useState } from "react";
import { removeCachedValue, removeCachedValuesByPrefix } from "../../../lib/cache";

export const useNameStep = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const saveName = async (firstName, lastName) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("User is not authenticated");
            }
            const userId = session.user.id;
            const { data, error } = await supabase
                .from('profiles')
                .upsert(
                    { id: userId, first_name: firstName, last_name: lastName },
                    { onConflict: 'id' }
                )
                .select('slug_value')
                .single();

            if (error) {
                throw new Error(error.message);
            }

            removeCachedValuesByPrefix("profile-info:");
            removeCachedValue(`profile-design:${userId}`);

            console.log("Name saved successfully");
            setSuccess(true);
            setError(null);
            return { success: true, slug: data?.slug_value || "" };

        } catch (error) {
            
            console.error("Error saving name:", error);
            setSuccess(false);
            setError(error.message);
            return { success: false, slug: "" };
        }
    };

    return { saveName, success, setSuccess, error, setError };
};
