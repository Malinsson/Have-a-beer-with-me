import React, { useState } from "react";
import { type ChangeEvent } from "react";

interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        password: string;
    };
  }

export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const clearForm = () => {
        setUsername("");
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (e: ChangeEvent) => {
        e.preventDefault();

        // Validate inputs before making an API call
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message ?? "Something went wrong, please try again.");
            }

            const data: LoginResponse = await response.json();
            console.log('Auth successful:', data);
            clearForm();
            // TODO: Store token and redirect to /design

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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
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