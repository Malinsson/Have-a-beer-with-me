import { SignupForm } from "../Auth/components/SignupForm";
import { ProgressDots } from "../../components/ProgressDots";

export const KontoStep = () => {
    return (
        <section className="flex flex-col gap-4">
            <div>
                <SignupForm
                hideSubmitButton />
            </div>
            <div>
                <ProgressDots total={4} current={4} />
            </div>
        </section>
    );
};
