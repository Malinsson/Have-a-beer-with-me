import React, { useState } from "react";

export const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearForm = () => {
        setUsername("");
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs before making an API call
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message ?? "Something went wrong, please try again.");
            }

            const data = await response.json();
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
                autoComplete="new-password"
            />

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading
                    ? "Creating account…"
                    : "Create account"}
            </button>
        </form>
    );
};

export default SignupForm;