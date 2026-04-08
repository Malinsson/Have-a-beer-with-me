import { useState } from "react";
import { SignupForm } from "../../Auth/components/SignupForm";
import { LoginForm } from "../../Auth/components/LoginForm";


export const KontoStep = ({ onSignupSuccess }) => {

    const [signUp, setSignUp] = useState(false);

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-1/2">
                    {signUp ? (
                        <SignupForm 
                        onSwitchToLogin={() => setSignUp(false)}
                        onSuccess={onSignupSuccess}
                        hideSubmitButton
                         />
                    ) : (
                        <LoginForm 
                        onSwitchToSignup={() => setSignUp(true)}
                        onSuccess={onSignupSuccess}
                        hideSubmitButton
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
