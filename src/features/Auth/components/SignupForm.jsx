import { useAuthFields } from "../hooks/useAuthFields";
import { useSignup } from "../hooks/useSignup";
import { Button } from "../../../shared/components/Button";


export const SignupForm = ({ formId = "signup-form", hideSubmitButton = false, onSuccess, onSwitchToLogin }) => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { signup, error, success, isLoading } = useSignup();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(email, password);
        if (result.success) {
            reset();
            onSuccess?.(result.redirectTo);
        }

    };
    
    return (
        <form
        id={formId}
        onSubmit={handleSubmit} noValidate autoComplete="off"
        className="border w-full mx-auto mt-4 flex flex-col p-4"
        >
            <label htmlFor="signupEmail" className="mt-4 py-1"><p>Mejladress</p></label>
            <input
            className="border border-b-grey px-4 py-2 w-full mx-auto"
                type="email"
                placeholder="epostadress@mail.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
            />

            <label htmlFor="signupPassword" className="mt-4 py-1"><p>Lösenord</p></label>
            <input 
                className="border border-b-grey px-4 py-2 w-full mx-auto"
                type="password" 
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required    
                minLength={8}
                autoComplete="new-password"
            />

            <div className="mt-2 text-yrgo-red">
                {error && <p role="alert">{error}</p>}
            </div>
            <div className="mt-2 text-green-600">
                {success && <p role="status">{success}</p>}
            </div>

            <a
                className="a-underline mt-2"
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitchToLogin?.();
                }}
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
