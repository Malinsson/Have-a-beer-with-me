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

    const handleSubmit = async (e: ChangeEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }

        if (!supabase) {
            setError("Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) {
                if (signInError.status === 400) {
                    throw new Error("Invalid email or password.");
                }
                throw signInError;
            }

            if (!data.user) {
                throw new Error("Login failed. No user was returned.");
            }

            console.log('Auth successful:', data);
            clearForm();
            // TODO: Redirect to protected page.

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} noValidate>
            <input 
                type="text" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
            />

            <input 
                type="password" 
                placeholder="Password"
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
                    ? "Signing in…"
                    : "Sign in"}
            </button>
        </form>
    );
};

export default LoginForm;