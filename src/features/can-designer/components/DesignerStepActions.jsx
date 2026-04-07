import { Button } from "../../../components/Button";

export const DesignerStepActions = ({
    step,
    canSkipKonto,
    onSetStep,
    onSocialContinue,
    onFinalizeAsGuest,
}) => {
    return (
        <>
            <div className="flex justify-center gap-4 mt-4">
                {step === "front" && (
                    <Button text="Designa Baksida" onClick={() => onSetStep("back")} variant="primary" />
                )}

                {step === "back" && (
                    <>
                        <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" />
                        <Button text="Gå vidare" onClick={() => onSetStep("info")} variant="primary" />
                    </>
                )}

                {step === "info" && (
                    <>
                        <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" showIcon={false} />
                        <Button text="Gå vidare" onClick={() => onSetStep("social")} variant="primary" />
                    </>
                )}
            </div>

            {step === "social" && (
                <div className="flex justify-center gap-4">
                    <Button text="Skippa" onClick={() => onSetStep("konto")} variant="outlined" showIcon={false} />
                    <Button text="Gå vidare" onClick={onSocialContinue} variant="primary" />
                </div>
            )}

            {step === "konto" && !canSkipKonto && (
                <div className="flex justify-center gap-4 mt-8">
                    <Button text="Gästkonto" onClick={onFinalizeAsGuest} variant="outlined" showIcon={false} />
                    <Button
                        text="Skapa konto"
                        onClick={() => document.getElementById("konto-signup-form")?.requestSubmit()}
                        variant="primary"
                    />
                </div>
            )}
        </>
    );
};
