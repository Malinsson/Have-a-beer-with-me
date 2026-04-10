import { Button } from "../../../shared/components/Button";
import { ProgressDots } from "../../../shared/components/ProgressDots";

export const DesignerStepActions = ({
    step,
    canSkipKonto,
    authMode = "signup",
    onSetStep,
    onSocialContinue,
    onFinalizeAsGuest,
}) => {

    const isLogin = authMode === "login";
    const primaryBtnText = isLogin ? "Logga in" : "Skapa konto";
    const formId = isLogin ? "login-form" : "signup-form";
    const handleSkipToAccount = () => {
        if (canSkipKonto) {
            onFinalizeAsGuest();
            return;
        }
        onSetStep("konto");
    };

    return (
        <>
            <div className="flex flex-col w-full mt-auto gap-4">
                
                {step === "front" && (
                    <Button text="Designa Baksida" onClick={() => onSetStep("back")} variant="primary" />
                )}

                {step === "back" && (
                    <div className="flex flex-col w-full">
                        <div className="mt-6 flex justify-center">
                            <ProgressDots total={4} current={1} />
                        </div>
                        <div className="flex flex-row gap-4 w-full mt-6">
                            <Button text="Skippa" onClick={handleSkipToAccount} variant="outlined" />
                            <Button text="Gå vidare" onClick={() => onSetStep("info")} variant="primary" />
                        </div>
                    </div>
                )}

                {step === "info" && (
                    <div className="flex flex-col w-full">
                        <div className="mt-6 flex justify-center">
                            <ProgressDots total={4} current={2} />
                        </div>
                        <div className="flex flex-row gap-4 w-full mt-6">
                            <Button text="Skippa" onClick={handleSkipToAccount} variant="outlined" showIcon={false} />
                            <Button text="Gå vidare" onClick={() => onSetStep("social")} variant="primary" />
                        </div>
                    </div>
                )}
            </div>

            {step === "social" && (
                <div className="flex flex-col w-full">
                    <div className="mt-6 flex justify-center">
                        <ProgressDots total={4} current={3} />
                    </div>
                    <div className="flex flex-row gap-4 w-full mt-6">
                        <Button text="Skippa" onClick={handleSkipToAccount} variant="outlined" showIcon={false} />
                        <Button text="Gå vidare" onClick={onSocialContinue} variant="primary" />
                    </div>
                </div>
            )}

            {step === "konto" && !canSkipKonto && (
                <div className="fixed bottom-0 right-0 left-0 flex flex-col w-full p-4 bg-white/80">
                    <div className="flex justify-center mb-4">
                        <ProgressDots total={4} current={4} />
                    </div>
                    
                    <div className="flex flex-row gap-4 w-full">
                        {/* Guest button usually stays as an alternative */}
                        <Button 
                            text="Gästkonto" 
                            onClick={onFinalizeAsGuest} 
                            variant="outlined" 
                            showIcon={false} 
                        />
                        
                        <Button
                            text={primaryBtnText}
                            onClick={() => document.getElementById(formId)?.requestSubmit()}
                            variant="primary"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
