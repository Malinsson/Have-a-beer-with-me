import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GuestSignup } from "../features/auth/components/GuestSignup";
import { useDesignStore } from "../store/designStore";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { NameStep } from "../features/can-designer/NameStep";
import { FrontStep } from "../features/can-designer/FrontStep";
import { BackStep } from "../features/can-designer/BackStep";
import { InfoStep } from "../features/can-designer/InfoStep";
import { SocialStep } from "../features/can-designer/SocialStep";
import { Modal } from "../components/Modal";
import baseCan from "../assets/images/baseCan.png";
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
    
    const [step, setStep] = useState("front");
    const [mode, setMode] = useState("image");
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    const timerRef = useRef(null);
    const hasHydratedRef = useRef(false);
    
    useEffect(() => {
        const unsubscribe = useDesignStore.subscribe((state, prevState) => {
            if (!hasHydratedRef.current) {
                hasHydratedRef.current = true;
                return;
            }

            const changed = 
            state.front !== prevState.front ||
            state.back !== prevState.back;
            
            if (!changed) return;
            
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
                const result = await useDesignStore.getState().saveDesign("Draft");
                if (!result.success) {
                    console.log("Auto-save failed:", result.error);
                }
            }, 700);
        });

        return () => {
            clearTimeout(timerRef.current);
            unsubscribe();
        };
    }, []);

    const front = useDesignStore((state) => state.front);
    const back = useDesignStore((state) => state.back);
    const setFront = useDesignStore((state) => state.setFront);
    const setBack = useDesignStore((state) => state.setBack);

    const handleTextureSelect = (textureId) => {
        setFront({ texturePreset: textureId });
    };

    const handleColorSelect = (colorHex) => {
        setFront({ textColor: colorHex });
    };

    const handleBackDescriptionChange = (description) => {
        setBack({ description });
    };

    const toggleOption = (id) => {
        const nextTags = back.tags.includes(id)
            ? back.tags.filter((tagId) => tagId !== id)
            : [...back.tags, id];

        setBack({ tags: nextTags });
    };

    const handleBack = () => {
        const currentIndex = STEPS.indexOf(step);
        if (currentIndex === 0) navigate(-1);
        else setStep(STEPS[currentIndex - 1]);
    };

    const handleSocialChange = (field, value) => {
        setBack({
            socials: {
                ...back.socials,
                [field]: value,
            },
        });
    };

    const handleCreateCan = async () => {
        const result = await useDesignStore.getState().saveDesign("Final design");
        if (result.success) {
            setModalOpen(true);
            return;
        }

        console.error("Failed to save design:", result.error);
    };

    return (
        <div className="container mx-auto p-4">
            <GuestSignup />
   
            {step !== "name" && (
                <img className="max-h-[50vh] mx-auto mb-6"
                 src={baseCan} alt="design preview" />
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
                    onModeChange={setMode}
                    selectedTexture={front.texturePreset}
                    selectedColor={front.textColor}
                    onTextureSelect={handleTextureSelect}
                    onColorSelect={handleColorSelect}
                />
            )}

            {step === "back" && (
                <BackStep
                    value={back.description}
                    onChange={handleBackDescriptionChange}
                />
            )}

            {step === "info" && (
                <InfoStep
                    selected={new Set(back.tags)}
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
                        instagram={back.socials.instagram}
                        linkedin={back.socials.linkedin}
                        github={back.socials.github}
                        onChange={handleSocialChange}
                    />
                    <div className="flex justify-center gap-4 mt-8">
                        <Button text="Skippa" onClick={() => setModalOpen(true)} variant="outlined" />
                        <Button text="Skapa ölburk" onClick={handleCreateCan} variant="primary" />
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
