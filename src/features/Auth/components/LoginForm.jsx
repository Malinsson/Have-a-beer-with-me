import { useLogin } from "../hooks/useLogin";
import { useAuthFields } from "../hooks/useAuthFields";


export const LoginForm = () => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            reset();
        }
    };

    const [showSignup, setShowSignup] = useState(false);

    return (
        <form onSubmit={handleSubmit} noValidate
        class="mt-2 p-4 bg-white max-w-md mx-auto"
        >
            <div class="flex flex-col gap-1 border border-gray-300 p-4 justify-center">

                <div>
                    <label htmlFor="loginEmail" class="block text-sm font-medium text-gray-700">Mejladress</label>

                    <input 
                    class="mt-2 px-4 py-2 border border-gray-300 rounded-xl bg-white max-w-md mx-auto"
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

                    <label htmlFor="loginPassword" class="block text-sm font-medium text-gray-700">Lösenord</label>

                    <input 
                    class="mt-2 px-4 py-2 border border-gray-300 rounded-xl bg-white max-w-md mx-auto"
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
                onClick={() => setShowSignup(true)}
                class="block mt-2 text-sm text-black"
                >Har inget konto? Skapa nu</a>

            </div>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isLoading}
            class="mt-2 px-4 py-2 shadow-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {isLoading
                    ? "Loggar in…"
                    : "Logga in"}
            </button>
        </form>
    );
};

export default LoginForm;