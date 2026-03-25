import { useState } from "react";
import { FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { ProgressDots } from "../components/ProgressDots";

import can from "../assets/images/can.jpg";
import cans from "../assets/images/cans.jpg";

const STEP_TITLE = {
    first: "Skapa din egen öl",
    secound: "Dela din öl och scanna andras på eventet",
    last:  "Vem är du?",
};

const STEP_SUBTITLE = {
    first: "Uttryck dig själv med en personligetikett",
    secound:  "Mingla och upptäck unika öl på eventet",
    last:  "Informationen kommer stå på din öl",
};

const STEP_IMG = {
    first: can,
    secound: cans,
};

const StepButtons = ({ onSkip, onNext }) => (
    <div className="flex flex-row gap-4">
      <button
        type="button"
        onClick={onSkip}
        className="border border-black rounded-full p-4 flex items-center gap-2"
      >
        Skippa <FaArrowRight />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white uppercase text-sm"
      >
        Nästa <FaArrowRight className="text-white" />
      </button>
    </div>
);

    
export const IntroPage = () => {
const [step, setStep] = useState("first");
const navigate = useNavigate();

    return (
        <>
            <div className="container mx-auto p-4">
                <h2 className="text-3xl text-center">{STEP_TITLE[step]}</h2>
                <h3 className="text-center mt-4">{STEP_SUBTITLE[step]}</h3>
            </div>

            <div className="container mx-auto p-4 flex justify-center">
                <img src={STEP_IMG[step]} alt="" />
            </div>

            {step === "first" && (
                <div className="flex flex-col p-4 justify-center items-center gap-6">
                    <section className="w-full">
                        <ProgressDots total={3} current={1} />
                    </section>
                    <div className="flex flex-row gap-4">
                        <StepButtons onSkip={() => setStep("last")} onNext={() => setStep("secound")} />
                    </div>
                </div>
            )}

            {step === "secound" && (
                <div className="flex flex-col p-4 justify-center items-center gap-6">
                    <section>
                        <ProgressDots total={3} current={2} />
                    </section>
                    <div className="flex flex-row gap-4">
                        <StepButtons onSkip={() => setStep("last")} onNext={() => setStep("last")} />
                    </div>
                </div>
            )}

            {step === "last" && (
                <div className="flex flex-col p-4 justify-center items-center gap-6">
                    <div className="border border-black rounded-lg px-6 py-6 w-full gap-4 flex flex-col">
                        <label>Förname</label>
                        <input 
                            type="text" 
                            placeholder="Anders"
                            className="border border-neutral-400 rounded-lg px-4 py-2 w-full resize-none"
                        />
                        <label>Efternamn</label>
                        <input 
                            type="text" 
                            placeholder="Andersson"
                            className="border border-neutral-400 rounded-lg px-4 py-2 w-full resize-none"
                        />
                        <label>Jobb/Studier</label>
                        <input 
                        type="text" 
                        placeholder="Webbutvecklare"
                        className="border border-neutral-400 rounded-lg px-4 py-2 w-full resize-none"
                    />
                    </div>
                    <section>
                        <ProgressDots total={3} current={3} />
                    </section>
                    <button
                        type="button"
                        onClick={() => navigate("/design")}
                        className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white uppercase text-sm"
                    >
                        Börja designa din öl
                        <FaArrowRight className="text-white" />
                    </button>
                </div>
            )}

        </>
    );
}

