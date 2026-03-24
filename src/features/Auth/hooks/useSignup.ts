import { useState } from 'react';
import supabase from "../../../lib/supabase";
import { getAuthErrorMessage } from './useAuthErrorMessage';

export const useSignup = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const signup = async (email: string, password: string): Promise<boolean> => {

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

            let userId: string | null = null;

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

            // Automatically create a profile for the new user
            const { error: userError } = await supabase
                .from('profiles')
                .upsert(
                    {
                        id: userId,
                    },
                    { onConflict: 'id' }
                );

            if (userError) {
                throw userError;
            }

            setSuccess('Konto skapat! Skapa din öl nu.');
            return true;

        } catch (err) {
            setError(getAuthErrorMessage(err, 'signup'));
            return false;
            
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