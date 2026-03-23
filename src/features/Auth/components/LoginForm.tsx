import React, { useState } from "react";
import { type ChangeEvent } from "react";
import supabase from "../../../lib/supabase";

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (signInError) {
                if (signInError.status === 400) {
                    throw new Error("Ogiltig mejladress eller lösenord.");
                }
                throw signInError;
            }

            if (!data.user) {
                throw new Error("Inloggning misslyckades. Inget användarobjekt returnerades.");
            }

            console.log('Auth successful:', data);
            clearForm();
            // TODO: Redirect to protected page.

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ett okänt fel inträffade');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} noValidate>
            <input 
                type="text" 
                placeholder="Mejladress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="mejladress"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
            />

            <input 
                type="password" 
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required    
                minLength={8}
                autoComplete={"current-password"}
            />

            <a href="/Create your own bear">Har inget konto? Skapa nu</a>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? "Loggar in…"
                    : "Logga in"}
            </button>
        </form>
    );
};

export default LoginForm;