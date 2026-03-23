import { useLogin } from "../hooks/useLogin";
import { useAuthFields } from "../hooks/useAuthFields";
import { type ChangeEvent } from "react";


export const LoginForm: React.FC = () => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            reset();
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