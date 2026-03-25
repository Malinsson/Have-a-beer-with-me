// import CanPreview3D from '../features/can-designer/components/CanPreview3D.tsx'
{/* <CanPreview3D /> */}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { FrontStep } from "../features/can-designer/FrontStep";
import { BackStep } from "../features/can-designer/BackStep";
import { InfoStep } from "../features/can-designer/InfoStep";
import { Modal } from "../components/Modal";
import slide1 from "../assets/carousel/img/slide1.jpg";

const STEP_TITLE = {
    front: "Burk framsida",
    back:  "Burk baksida",
    info:  "Innehållsförteckning",
    social: "Kontaktuppgifter",
};

const STEP_SUBTITLE = {
    front: "Anpassa Burkens Font",
    back:  "Vad inspirerar dig mest?",
    info:  "Jag är intresserad av",
    social: "Vill du lägga till sociala medier?",
};

export const DesignerPage = () => {
    
    const [step, setStep] = useState("front");
    const [mode, setMode] = useState("image");
    const [selectedTexture, setSelectedTexture] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [backText, setBackText] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();
  
    const toggleOption = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="container mx-auto p-4">
    
            <h2 className="text-3xl text-center">{STEP_TITLE[step]}</h2>
        
            <img src={slide1} alt="design preview" />
        
            <h3 className="text-center mt-4">{STEP_SUBTITLE[step]}</h3>
        
            {/* Steps */}
            {step === "front" && (
                <FrontStep
                    mode={mode}
                    selectedTexture={selectedTexture}
                    selectedColor={selectedColor}
                    onModeChange={setMode}
                    onTextureSelect={setSelectedTexture}
                    onColorSelect={setSelectedColor}
                />
            )}

            {step === "back" && (
                <BackStep
                    value={backText}
                    onChange={setBackText}
                />
            )}

            {step === "info" && (
                <InfoStep
                    selected={selected}
                    onToggle={toggleOption}
                />
             )}

            {/* Bottom buttons */}
            <div className="flex justify-center gap-4 mt-8">
                {step === "front" && (
                    <button
                        type="button"
                        onClick={() => setStep("back")}
                        className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white"
                    >
                        Baksida
                        <FaArrowRight className="text-white" />
                    </button>
                )}

                {step === "back" && (
                    <>
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="border border-black rounded-full p-4 flex items-center gap-2"
                        >
                            Skippa
                            <FaArrowRight />
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep("info")}}
                            className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white"
                        >
                            Gå vidare
                            <FaArrowRight className="text-white" />
                        </button>
                    </>
                )}

                {step === "info" && (
                    <>
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="border border-black rounded-full p-4 flex items-center gap-2"
                        >
                            Skippa
                            <FaArrowRight />
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white"
                        >
                            Skapa ölburk
                            <FaArrowRight className="text-white" />
                            
                        </button>
                    </>
                )}
            </div>
                  
            {/* Modal */}
            {modalOpen && (
                <Modal onConfirm={() => navigate("/profile/1")} />
            )}

        </div>
    );
};