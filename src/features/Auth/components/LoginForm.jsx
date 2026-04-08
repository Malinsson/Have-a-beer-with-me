import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuthFields } from "../hooks/useAuthFields";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "../../../shared/components/Button";


export const LoginForm = ({ onSwitchToSignup, onSuccess }) => {

    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { login, error, isLoading } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            reset();
            onSuccess?.(result.redirectTo);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate
        className="mt-2"
        >
            <div className="flex flex-col gap-4 border p-4 my-4 justify-center">

                <div>
                    <label htmlFor="loginEmail"><p>Mejladress</p></label>

                    <input 
                        className="mt-2 px-4 py-2 border w-full text-sm"
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
                        style={{ fontSize: "0.8rem" }}
                    />
                </div>

                <div>

                    <label htmlFor="loginPassword" className="mt-2"><p>Lösenord</p></label>

                    <div className="grid grid-flow-col gap-3">
                        <input 
                            className="mt-2 px-4 py-2 border col-span-3 text-sm"
                            id="loginPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required    
                            minLength={8}
                            autoComplete={"current-password"}
                            style={{ fontSize: "0.8rem" }}
                        />

                        <Button 
                            type="button"
                            variant="outlined"
                            icon={showPassword ? LuEye : LuEyeClosed}
                            className="mt-2 w-10 h-10 flex items-center justify-center col-span-1"
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    </div>
                </div>

                <a 
                className="a-underline"
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onSwitchToSignup?.();
                }}
                >Har inget konto? Skapa nu!</a>

            </div>

            {error && <p role="alert">{error}</p>}

            <Button 
                type="submit" 
                disabled={isLoading}
                text={isLoading ? "Loggar in…" : "Logga in"}
                className="w-full"
            />

        </form>
    );
};

export default LoginForm;