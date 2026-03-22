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
        setSuccess(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password
            });

            if (signUpError) {
                if (signUpError.status === 422) {
                    throw new Error('Signup failed. This email may already be registered, or the password does not meet policy requirements.');
                }
                throw signUpError;
            }

            if (!data.user?.id) {
                throw new Error("User was created, but no user id was returned.");
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

            setSuccess("Account created. If email confirmation is enabled, check your inbox before signing in.");
            clearForm();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} noValidate>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
            />

            <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required    
                minLength={8}
                autoComplete="new-password"
            />

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? "Creating account…"
                    : "Create account"}
            </button>
        </form>
    );
};

export default SignupForm;