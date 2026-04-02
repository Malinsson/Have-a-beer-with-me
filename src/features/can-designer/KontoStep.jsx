import { SignupForm } from "../Auth/components/SignupForm";
import { ProgressDots } from "../../components/ProgressDots";
import { useIsSignedIn } from "../../shared/hooks/useIsSignedIn";

export const KontoStep = ({ onSignupSuccess }) => {
    const isSignedIn = useIsSignedIn();
        if (isSignedIn) {
        onSignupSuccess?.();
        return null; // or a loading spinner, or a message saying "Redirecting..."
    }
    return (
        <section className="flex flex-col gap-4">
            <div>
                <SignupForm
                    formId="konto-signup-form"
                    hideSubmitButton
                    onSuccess={onSignupSuccess}
                />
            </div>
            <div>
                <ProgressDots total={4} current={4} />
            </div>
        </section>
    );
};
