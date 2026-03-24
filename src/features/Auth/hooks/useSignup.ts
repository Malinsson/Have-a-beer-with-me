import { useState } from 'react';
import supabase from "../../../lib/supabase";
import { getAuthErrorMessage } from './useAuthErrorMessage';

export const useSignup = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const signup = async (email: string, password: string): Promise<boolean> => {

        if (!email.trim() || !password) {
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
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password
            });

            if (signUpError) {
                setError(getAuthErrorMessage(signUpError, 'signup'));
                return false;
            }

            if (!data.user?.id) {
                throw new Error('Konto skapades inte. Inget användar-ID returnerades.');
            }

            const { error: userError } = await supabase
                .from('profiles')
                .upsert(
                    {
                        id: data.user.id,
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