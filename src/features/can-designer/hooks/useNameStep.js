import supabase from "../../../lib/supabase";
import { useState } from "react";

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

            const { error } = await supabase
                .from('profiles')
                .upsert({ id: userId, first_name: firstName, last_name: lastName }, { onConflict: 'id' });

            if (error) {
                throw new Error(error.message);
            }

            console.log("Name saved successfully");
            setSuccess(true);
            setError(null);
            return true;
        } catch (error) {
            console.error("Error saving name:", error);
            setSuccess(false);
            setError(error.message);
            return false;
        }
    };

    return { saveName, success, setSuccess, error, setError };
};
