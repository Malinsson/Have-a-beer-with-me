import { useLogin } from "../hooks/useLogin";
import { useAuthFields } from "../hooks/useAuthFields";
import { Button } from "../../../components/Button";


export const LoginForm = ({ onSwitchToSignup, onSuccess }) => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            reset();
            onSuccess?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate
        className="mt-2 p-4"
        >
            <div className="flex flex-col gap-4 border p-4 mb-4 justify-center">

                <div>
                    <label htmlFor="loginEmail"><p>Mejladress</p></label>

                    <input 
                        className="mt-2 px-4 py-2 border w-full"
                        id="loginEmail"
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
                </div>

                <div>

                    <label htmlFor="loginPassword" className="mt-2"><p>Lösenord</p></label>

                    <input 
                        className="mt-2 px-4 py-2 border w-full"
                        id="loginPassword"
                        type="password" 
                        placeholder="Lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required    
                        minLength={8}
                        autoComplete={"current-password"}
                    />
                </div>

                <a href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitchToSignup?.();
                }}
                >Har inget konto? Skapa nu!</a>

            </div>

            {error && <p role="alert">{error}</p>}

            {/* <button type="submit" disabled={isLoading}
            className="mt-4 py-2 px-4 bg-dark-blue text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {isLoading
                    ? "Loggar in…"
                    : "Logga in"}
            </button> */}
            <div className="w-full">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    text={isLoading ? "Loggar in…" : "Logga in"}
                />
            </div>
        </form>
    );
};

export default LoginForm;