import { useState } from "react";
import { SignupForm } from "../../Auth/components/SignupForm";
import { LoginForm } from "../../Auth/components/LoginForm";


export const KontoStep = ({ authMode, onAuthModeChange, onSignupSuccess }) => {

    const isSignup = authMode === "signup";

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-1/2">
                    {isSignup ? (
                        <SignupForm 
                            // Call the prop function to update the parent state
                            onSwitchToLogin={() => onAuthModeChange("login")}
                            onSuccess={onSignupSuccess}
                            hideSubmitButton 
                        />
                    ) : (
                        <LoginForm 
                            // Call the prop function to update the parent state
                            onSwitchToSignup={() => onAuthModeChange("signup")}
                            onSuccess={onSignupSuccess}
                            hideSubmitButton
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
