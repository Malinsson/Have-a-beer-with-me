import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressDots } from "../shared/components/ProgressDots";
import { NameStep } from "../features/can-designer/steps/NameStep";
import { GuestSignup } from "../features/Auth/components/GuestSignup";


import can from "../assets/images/baseCan.svg";
import onboardP2Comp from "../assets/animations/onbordP2Comp.mp4";
import { Button } from "../shared/components/Button";

const STEPS = ["first", "secound", "last"];

const STEP_TITLE = {
    first: "Skapa din egna burk",
    secound: "Mingla",
    last:  "Vem är du?",
};

const STEP_SUBTITLE = {
    first: "Uttryck dig själv med en personlig design",
    secound:  "Scanna andras burkar och samla dem i din Barhylla",
    last:  "Namnge din burk med ditt eget namn.",
};

const STEP_IMG = {
    first: can
};
    
export const IntroPage = () => {
    const [step, setStep] = useState("first");
    const navigate = useNavigate();

    return (
        <section className="flex flex-col min-h-[calc(100vh-80px)]">
                <div className="p-4 shrink-0">
                    <h2>{STEP_TITLE[step]}</h2>
                    <p className="pt-3 w-55">{STEP_SUBTITLE[step]}</p>
                </div>

                {step === "first" && (
                    <div className="flex justify-center items-center p-4 w-5/6 mx-auto">
                        <img 
                            src={STEP_IMG[step]} 
                            alt=""
                            className="max-h-full max-w-full object-contain" 
                        />
                    </div>
                )}

                {step === "first" && (
                    <div className="fixed bottom-0 left-0 right-0 flex flex-col p-4 justify-center items-center gap-6 mt-2">
                        <section>
                            <ProgressDots total={3} current={1} />
                        </section>
                        <div className="flex flex-row gap-4 w-full">
                            <Button text="Skippa" onClick={() => setStep("last")} variant="outlined" />
                            <Button text="Nästa" onClick={() => setStep("secound")} />
                        </div>
                    </div>
                )}

                {step === "secound" && (
                <div className="flex flex-col flex-1 min-h-0 items-stretch p-4">
                    <div className="flex flex-1 items-start p-4 w-5/6 mx-auto overflow-hidden">
                        <video 
                            src={onboardP2Comp} 
                            alt="Två animerade burkar som skålar mot varandra"
                            className="max-h-full max-w-full object-contain"
                            playsInline
                            autoPlay
                            loop
                            muted
                        />
                    </div>
                    <div className="flex flex-col w-full gap-6 mt-auto">
                        <section>
                            <ProgressDots total={3} current={2} />
                        </section>
                        <div className="flex flex-row gap-4 w-full">
                            <Button text="Skippa" onClick={() => setStep("last")} variant="outlined" />
                            <Button text="Nästa" onClick={() => setStep("last")} variant="primary" />
                        </div>
                    </div>
                </div>
                )}

                {step === "last" && (
                    <div className="flex flex-col flex-1 p-4 items-stretch gap-6 w-full">
                        <GuestSignup />
                        <NameStep />
                    </div>
                )}
        </section>
    );
}

