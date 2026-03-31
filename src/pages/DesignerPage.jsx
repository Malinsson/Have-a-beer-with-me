import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuestSignup } from "../features/auth/components/GuestSignup";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { NameStep } from "../features/can-designer/NameStep";
import { FrontStep } from "../features/can-designer/FrontStep";
import { BackStep } from "../features/can-designer/BackStep";
import { InfoStep } from "../features/can-designer/InfoStep";
import { SocialStep } from "../features/can-designer/SocialStep";
import { Modal } from "../components/Modal";
import slide1 from "../assets/carousel/img/slide1.jpg";
import { Button } from "../components/Button";
import { BackButton } from "../components/BackButton";

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

const STEPS = ["front", "back", "info", "social"];

export const DesignerPage = () => {
    
    const [step, setStep] = useState("name");
    const [mode, setMode] = useState("image");
    const [selectedTexture, setSelectedTexture] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [backText, setBackText] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [socials, setSocials] = useState({ instagram: "", linkedin: "", github: "" });
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();
  
    const toggleOption = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleBack = () => {
        const currentIndex = STEPS.indexOf(step);
        if (currentIndex === 0) navigate(-1);
        else setStep(STEPS[currentIndex - 1]);
    };

    const handleSocialChange = (field, value) => {
        setSocials((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container mx-auto p-4">
            <GuestSignup />
   
            {step !== "name" && (
                <img src={slide1} alt="design preview" />
            )}

            <div className="flex items-center justify-between mb-6">
                <BackButton onClick={handleBack} />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">{STEP_TITLE[step]}</h2>
            </div>
        
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
                        <Button text="Gå vidare" onClick={() => setStep("social")} variant="primary" />
                    </>
                )}
            </div>

            {step === "social" && (
                <>
                    <SocialStep
                        instagram={socials.instagram}
                        linkedin={socials.linkedin}
                        github={socials.github}
                        onChange={handleSocialChange}
                    />
                    <div className="flex justify-center gap-4 mt-8">
                        <Button text="Skippa" onClick={() => setModalOpen(true)} variant="outlined" />
                        <Button text="Skapa ölburk" onClick={() => setModalOpen(true)} variant="primary" />
                    </div>
                </>
            )}
                  
            {/* Modal */}
            {modalOpen && (
                <Modal onConfirm={() => navigate("/profile/1")} />
            )}

        </div>
    );
};
