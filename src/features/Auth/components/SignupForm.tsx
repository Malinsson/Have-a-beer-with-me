import React, { useState } from "react";
import { type ChangeEvent } from "react";
import supabase from "../../../lib/supabase";

export const SignupForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const clearForm = () => {
        setEmail("");
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            setError('Mejladress och lösenord krävs.');
            return;
        }

        if (!supabase) {
            setError('Supabase är inte konfigurerat. Kontrollera dina VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.');
            return;
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
                if (signUpError.status === 422) {
                    throw new Error('Kontot finns redan. Prova att logga in istället.');
                }
                throw signUpError;
            }

            if (!data.user?.id) {
                throw new Error('Konto skapades inte. Inget användar-ID returnerades.');
            }

            const { error: userError } = await supabase
                .from('profiles')
                .upsert(
                    {
                        id: data.user.id,
                        username: email.trim().toLowerCase(),
                    },
                    { onConflict: 'id' }
                );

            if (userError) {
                throw userError;
            }

            setSuccess('Konto skapat! Skapa din öl nu.');
            clearForm();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Okänt fel inträffade');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} noValidate>
            <input
                type="email"
                placeholder="Mejladress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="mejladress"
            />

            <input 
                type="password" 
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required    
                minLength={8}
                autoComplete="nytt-lösenord"
            />

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? "Skapar konto…"
                    : "Skapa konto"}
            </button>
        </form>
    );
};

export default SignupForm;