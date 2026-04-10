import { useState } from "react";
import { useAuthFields } from "../hooks/useAuthFields";
import { useSignup } from "../hooks/useSignup";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "../../../shared/components/Button";

export const SignupForm = ({ formId = "signup-form", hideSubmitButton = false, onSuccess, onSwitchToLogin }) => {
    const { email, setEmail, password, setPassword, reset } = useAuthFields();
    const { signup, error, success, isLoading } = useSignup();
    const [showPassword, setShowPassword] = useState(false);

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
            onSubmit={handleSubmit} 
            noValidate 
            autoComplete="off"
            className="mt-2"
        >
            <div className="flex flex-col gap-4 border p-4 my-4 justify-center">
                {/* Email Section */}
                <div>
                    <label htmlFor="signupEmail"><p>Mejladress</p></label>
                    <input
                        className="mt-2 px-4 py-2 border w-full text-sm"
                        id="signupEmail"
                        type="email"
                        placeholder="Mejladress" // Matched placeholder
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off" // Added from Login
                        spellCheck={false} // Added from Login
                        style={{ fontSize: "0.8rem" }} // Added from Login
                    />
                </div>

                {/* Password Section */}
                <div>
                    <label htmlFor="signupPassword" className="mt-2"><p>Lösenord</p></label>
                    <div className="grid grid-flow-col gap-3"> {/* Matched grid-flow-col */}
                        <input
                            className="mt-2 px-4 py-2 border col-span-3 text-sm"
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Lösenord" // Matched placeholder
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
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

                {/* Toggle Link */}
                <a
                    className="a-underline"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToLogin?.();
                    }}
                >
                    Har du redan ett konto? Logga in
                </a>
            </div>

            {/* Error & Success Messages */}
            <div className="mt-2">
                {error && <p className="text-yrgo-red" role="alert">{error}</p>}
                {success && <p className="text-green-600" role="status">{success}</p>}
            </div>

            {/* Submit Button */}
            {!hideSubmitButton && (
                <Button
                    type="submit"
                    disabled={isLoading}
                    text={isLoading ? "Skapar konto…" : "Skapa konto"}
                    className="w-full"
                />
            )}
        </form>
    );
};