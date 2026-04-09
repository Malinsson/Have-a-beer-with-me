import { Button } from "../../../shared/components/Button";
import { ProgressDots } from "../../../shared/components/ProgressDots";

export const DesignerStepActions = ({
    step,
    canSkipKonto,
    onSetStep,
    onSocialContinue,
    onFinalizeAsGuest,
}) => {
    return (
        <>
            <div className="fixed bottom-0 right-0 left-0 flex justify-center gap-4 p-4">
                {step === "front" && (
                    <Button text="Designa Baksida" onClick={() => onSetStep("back")} variant="primary" />
                )}

                {step === "back" && (
                    <>
                        <div className="mt-6 flex justify-center">
                            <ProgressDots total={4} current={1} />
                        </div>
                        <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" />
                        <Button text="Gå vidare" onClick={() => onSetStep("info")} variant="primary" />
                    </>
                )}

                {step === "info" && (
                    <>
                        <div className="mt-6 flex justify-center">
                            <ProgressDots total={4} current={2} />
                        </div>
                        <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" showIcon={false} />
                        <Button text="Gå vidare" onClick={() => onSetStep("social")} variant="primary" />
                    </>
                )}
            </div>

            {step === "social" && (
                <>
                    <div className="mt-6 flex justify-center">
                        <ProgressDots total={4} current={3} />
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" showIcon={false} />
                        <Button text="Gå vidare" onClick={onSocialContinue} variant="primary" />
                    </div>
                </>
            )}

            {step === "konto" && !canSkipKonto && (
                <>
                    <div className="mt-6 flex justify-center">
                        <ProgressDots total={4} current={4} />
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <Button text="Gästkonto" onClick={onFinalizeAsGuest} variant="outlined" showIcon={false} />
                        <Button
                            text="Skapa konto"
                            onClick={() => document.getElementById("signup-form")?.requestSubmit()}
                            variant="primary"
                        />
                    </div>
                </>
            )}
        </>
    );
};
