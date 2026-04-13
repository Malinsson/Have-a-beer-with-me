import { useState } from 'react';
import supabase from "../../../lib/supabase";
import { getAuthErrorMessage } from './useAuthErrorMessage';
import { resolveProfileRedirect } from './resolveProfileRedirect';

export const useSignup = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const signup = async (email, password) => {

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
        setSuccess(null);

        try {
            // Check for existing guest session to upgrade an anonymous user to a registered account
            const {
                data: { session },
            } = await supabase.auth.getSession();

            let userId = null;

            if (session?.user?.is_anonymous) {
                const { data: upgradedData, error: upgradeError } = await supabase.auth.updateUser({
                    email: normalizedEmail,
                    password,
                });

                if (upgradeError) {
                    setError(getAuthErrorMessage(upgradeError, 'signup'));
                    return false;
                }

                userId = upgradedData.user?.id ?? session.user.id;

            } else {
                // No session — proceed with normal sign-up
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: normalizedEmail,
                    password,
                });

                if (signUpError) {
                    setError(getAuthErrorMessage(signUpError, 'signup'));
                    return false;
                }

                userId = data.user?.id ?? null;
            }

            if (!userId) {
                throw new Error('Konto skapades inte. Inget användar-ID returnerades.');
            }
            
            setSuccess('Konto skapat! Skapa din burk nu.');
            const redirectTo = await resolveProfileRedirect();
            return { success: true, redirectTo };

        } catch (err) {
            setError(getAuthErrorMessage(err, 'signup'));
            return { success: false, redirectTo: '/login' };
            
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signup,
        error,
        isLoading,
        success
    }
};