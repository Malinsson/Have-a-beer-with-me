import { useAuthFields } from "../hooks/useAuthFields";
import { useSignup } from "../hooks/useSignup";


export const SignupForm = () => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { signup, error, success, isLoading } = useSignup();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const created = await signup(email, password);
        if (created) {
            reset();
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