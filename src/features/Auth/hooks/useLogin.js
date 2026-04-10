import { useState } from 'react';
import supabase from "../../../lib/supabase";
import { getAuthErrorMessage } from './useAuthErrorMessage';
import { resolveProfileRedirect } from './resolveProfileRedirect';


export const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email, password) => {

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            setError('Mejladress och lösenord krävs.');
            return false;
        }

        if (!supabase) {
            setError('Supabase är inte konfigurerat. Kontrollera dina VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            });

            if (signInError) {
                throw signInError;
            }

            if (!data.user) {
                throw new Error("Inloggning misslyckades. Inget användarobjekt returnerades.");
            }

            console.log('Auth successful:', data);
            const redirectTo = await resolveProfileRedirect();
            return { success: true, redirectTo };

        } catch (err) {
            setError(getAuthErrorMessage(err, 'login'));
            return { success: false, redirectTo: '/login' };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        error,
        isLoading
    }
};