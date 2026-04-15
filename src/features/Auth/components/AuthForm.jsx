import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useSignup } from "../hooks/useSignup";
import { useAuthFields } from "../hooks/useAuthFields";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "../../../shared/components/Button";

export const AuthForm = ({ formId, mode = "signup", onModeChange, hideSubmitButton = false, onSuccess }) => {
    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { login, error: loginError, isLoading: isLoginLoading } = useLogin();
    const { signup, error: signupError, success, isLoading: isSignupLoading } = useSignup();
    const [showPassword, setShowPassword] = useState(false);

    const isLogin = mode === "login";
    const effectiveFormId = formId || (isLogin ? "login-form" : "signup-form");
    const toggleMode = () => onModeChange?.(isLogin ? "signup" : "login");
    const submitText = isLogin ? "Logga in" : "Skapa konto";
    const loadingText = isLogin ? "Loggar in…" : "Skapar konto…";
    const switchFormText = isLogin ? "Har inget konto? Skapa nu!" : "Har redan ett konto? Logga in!";
    const currentError = isLogin ? loginError : signupError;
    const isSubmitting = isLogin ? isLoginLoading : isSignupLoading;
    const passwordAutoComplete = isLogin ? "current-password" : "new-password";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            const result = await login(email, password);
            if (result.success) {
                reset();
                onSuccess?.(result.redirectTo);
            }
        } else {
            const result = await signup(email, password);
            if (result.success) {
                reset();
                onSuccess?.(result.redirectTo);
            }
        }
    };

    return (
        <form 
            id={effectiveFormId}
            onSubmit={handleSubmit} 
            className="mt-2"
        >
            <div className="flex flex-col gap-4 border p-4 my-4 justify-center">

                <div>
                    <label htmlFor={`${effectiveFormId}-email`}><p>Mejladress</p></label>

                    <input 
                        className="mt-2 px-4 py-2 border w-full text-sm"
                        id={`${effectiveFormId}-email`}
                        type="email" 
                        placeholder="Mejladress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={100}
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        style={{ fontSize: "0.8rem" }}
                    />
                </div>

                <div>

                    <label htmlFor={`${effectiveFormId}-password`} className="mt-2"><p>Lösenord</p></label>

                    <div className="grid grid-flow-col gap-3">
                        <input 
                            className="mt-2 px-4 py-2 border col-span-3 text-sm"
                            id={`${effectiveFormId}-password`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required    
                            minLength={8}
                            maxLength={100}
                            autoComplete={passwordAutoComplete}
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
                    toggleMode();
                }}
                >{switchFormText}</a>

            </div>

            {currentError && <p role="alert">{currentError}</p>}
            {!isLogin && success && <p className="text-green-600" role="status">{success}</p>}


            {!hideSubmitButton && (
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    text={isSubmitting ? loadingText : submitText}
                    className="w-full"
                />
            )}

        </form>

    );
};

export default AuthForm;