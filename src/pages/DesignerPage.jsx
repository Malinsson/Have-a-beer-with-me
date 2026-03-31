// import CanPreview3D from '../features/can-designer/components/CanPreview3D.tsx'
{/* <CanPreview3D /> */}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuestSignup } from "../features/auth/components/GuestSignup";
import { useDesignStore } from "../store/designStore";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { NameStep } from "../features/can-designer/NameStep";
import { FrontStep } from "../features/can-designer/FrontStep";
import { BackStep } from "../features/can-designer/BackStep";
import { InfoStep } from "../features/can-designer/InfoStep";
import { Modal } from "../components/Modal";
import slide1 from "../assets/carousel/img/slide1.jpg";
import { Button } from "../components/Button";

const STEP_TITLE = {
    name: "Vem är du?",
    front: "Burk framsida",
    back:  "Burk baksida",
    info:  "Innehållsförteckning",
    social: "Kontaktuppgifter",
};

const STEP_SUBTITLE = {
    name: "Informationen kommer att stå på din öl",
    front: "Anpassa Burkens Font",
    back:  "Vad inspirerar dig mest?",
    info:  "Jag är intresserad av",
    social: "Vill du lägga till sociala medier?",
};

export const DesignerPage = () => {
    
    const [step, setStep] = useState("front");
    const [mode, setMode] = useState("image");
    const [modalOpen, setModalOpen] = useState(false);

    const [selected, setSelected] = useState(new Set());
    const navigate = useNavigate();

    const front = useDesignStore((state) => state.front);
    const back = useDesignStore((state) => state.back);

    const loadDesign = async (designId) => {
        const result = await useDesignStore.getState().loadDesign(designId);
        if (result.success) {
            console.log("Design loaded successfully");
        } else {
            console.error("Failed to load design:", result.error);
        }};

    const saveDesign = async (designName, shareId) => {
        const result = await useDesignStore.getState().saveDesign(designName, shareId);
        if (result.success) {
            console.log("Design saved successfully with ID:", result.designId);
        } else {
            console.error("Failed to save design:", result.error);
        }};
  
    const toggleOption = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="container mx-auto p-4">
            <GuestSignup />
    
            <h2 className="text-3xl text-center">{STEP_TITLE[step]}</h2>

            {step !== "name" && (
                <img src={slide1} alt="design preview" />
            )}

            <h3 className="text-center mt-4">{STEP_SUBTITLE[step]}</h3>
        
            {/* Steps */}
            {step === "name" && (
                <NameStep 
                    onNext={() => setStep("front")}
                    
                />
                
            )}
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
                    <Button text="Baksida" onClick={() => setStep("back")} variant="primary" />
                )}

                {step === "back" && (
                    <>
                        <Button text="Skippa" onClick={() => setModalOpen(true)} variant="outlined" />
                        <Button text="Gå vidare" onClick={() => setStep("info")} variant="primary" />
                    </>
                )}

                {step === "info" && (
                    <>
                        <Button text="Skippa" onClick={() => setModalOpen(true)} variant="outlined" />
                        <Button text="Skapa ölburk" onClick={() => setModalOpen(true)} variant="primary" />
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