import React, { useState } from "react";
import { type ChangeEvent } from "react";

interface LoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
    };
  }
   
  type AuthMode = "login" | "register";

export const LoginForm: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>("login");
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
        
        const endpoint = mode === "login" ? "/api/login" : "/api/register";

        try {
            const response = await fetch(endpoint, {
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
            <div>
                <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); }}
                    aria-selected={mode === "login"}>
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => { setMode("register"); setError(null); }}
                    aria-selected={mode === "register"}>
                    Create Account
                </button>
            </div>

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
                minLength={mode === "register" ? 8 : undefined}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? mode === "login" ? "Signing in…" : "Creating account…"
                    : mode === "login" ? "Sign in" : "Create account"}
            </button>
        </form>
    );
};

export default LoginForm;