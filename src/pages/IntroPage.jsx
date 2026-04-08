import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressDots } from "../components/ProgressDots";
import { NameStep } from "../features/can-designer/NameStep";
import { GuestSignup } from "../features/Auth/components/GuestSignup";


import can from "../assets/images/baseCan.png";
import cans from "../assets/images/cans.jpg";
import { Button } from "../components/Button";

const STEPS = ["first", "secound", "last"];

const STEP_TITLE = {
    first: "Skapa din egna burk",
    secound: "Mingla",
    last:  "Vem är du?",
};

const STEP_SUBTITLE = {
    first: "Uttryck dig själv med en personlig design",
    secound:  "Scanna andras burkar och samla dem i din Barhylla",
    last:  "Namnge din öl med ditt eget namn.",
};

const STEP_IMG = {
    first: can,
    secound: cans,
};
    
export const IntroPage = () => {
    const [step, setStep] = useState("first");
    const navigate = useNavigate();

    return (
        <>

            <div className="p-4">
                <h2>{STEP_TITLE[step]}</h2>
                <p className="pt-3 w-55">{STEP_SUBTITLE[step]}</p>
            </div>

            {(step === "first" || step === "secound") && (
                <div className="mx-auto p-4 flex justify-center">
                    <img src={STEP_IMG[step]} alt="" />
                </div>
            )}

            {step === "first" && (
                <div className="flex flex-col p-4 justify-center items-center gap-6">
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
                <div className="flex flex-col p-4 justify-center items-center gap-6">
                    <section>
                        <ProgressDots total={3} current={2} />
                    </section>
                    <div className="flex flex-row gap-4 w-full">
                        <Button text="Skippa" onClick={() => setStep("last")} variant="outlined" />
                        <Button text="Nästa" onClick={() => setStep("last")} variant="primary" />
                    </div>
                </div>
            )}

            {step === "last" && (
                <div className="flex flex-col p-4 justify-center items-center gap-6">
                    <GuestSignup />
                    <NameStep />
                </div>
            )}

        </>
    );
}

