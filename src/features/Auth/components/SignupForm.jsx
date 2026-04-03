import { useAuthFields } from "../hooks/useAuthFields";
import { useSignup } from "../hooks/useSignup";
import { Button } from "../../../components/Button";


export const SignupForm = ({ formId = "signup-form", hideSubmitButton = false, onSuccess, onSwitchToLogin }) => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { signup, error, success, isLoading } = useSignup();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const created = await signup(email, password);
        if (created) {
            reset();
            onSuccess?.();
        }

    };
    
    return (
        <form
        id={formId}
        onSubmit={handleSubmit} noValidate autoComplete="off"
        className=" bg-white w-full mx-auto"
        >
            
            <label htmlFor="signupEmail" className="block text-sm font-medium py-1">Mejladress</label>
            <input
            className="px-4 py-2 border border-var(--border-color) bg-white w-full mx-auto"
                type="email"
                placeholder="Mejladress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
            />

            <label htmlFor="signupPassword" className="block text-sm font-medium mt-4 py-1">Lösenord</label>
            <input 
            className="px-4 py-2 border border-var(--border-color) bg-white w-full mx-auto"
                type="password" 
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required    
                minLength={8}
                autoComplete="new-password"
            />

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitchToLogin?.();
                }}
                className="text-sm mt-2 inline-block underline"
            >
                Har du redan ett konto? Logga in
            </a>

            {!hideSubmitButton && (
            <Button type="submit" disabled={isLoading}
                text={isLoading ? "Skapar konto…" : "Skapa konto"}
                    >
            </Button>
            )}
        </form>
    );
};
