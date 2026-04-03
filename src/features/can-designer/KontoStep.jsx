import { SignupForm } from "../Auth/components/SignupForm";
import { ProgressDots } from "../../components/ProgressDots";

export const KontoStep = ({ onSignupSuccess }) => {
    return (
        <>
            <section className="flex flex-col gap-4">
                <div>
                    <SignupForm
                        formId="konto-signup-form"
                        hideSubmitButton
                        onSuccess={onSignupSuccess}
                    />
                </div>
            </section>
            <div className="mt-6">
                <ProgressDots total={4} current={4} />
            </div>
        </>
    );
};
