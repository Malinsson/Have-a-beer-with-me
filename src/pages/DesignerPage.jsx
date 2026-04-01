import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GuestSignup } from "../features/auth/components/GuestSignup";
import { useDesignStore } from "../store/designStore";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { KontoStep } from "../features/can-designer/KontoStep";
import { FrontStep } from "../features/can-designer/FrontStep";
import { BackStep } from "../features/can-designer/BackStep";
import { InfoStep } from "../features/can-designer/InfoStep";
import { SocialStep } from "../features/can-designer/SocialStep";
import { Modal } from "../components/Modal";
import baseCan from "../assets/images/baseCan.png";
import { Button } from "../components/Button";
import { BackButton } from "../components/BackButton";

const STEP_TITLE = {
    front: "Burkens framsida",
    back:  "Burkens baksida",
    info:  "Burkens baksida",
    social: "Burkens baksida",
    konto: "Skapa konto",
};

const STEP_SUBTITLE = {
    front: "",
    back:  'Beskriv din största "AHA-Upplevelse" (max 140 tecken)',
    info:  "",
    social: "Lägg till kontakt uppgifter",
    konto: "Skapa ett konto för att spara din burk"
};

const STEPS = ["front", "back", "info", "social", "konto"];

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
        const MAX_TAGS = 3;
        const isAlreadySelected = back.tags.includes(id);

        if (!isAlreadySelected && back.tags.length >= MAX_TAGS) {
            return;
        }

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
   
            <div className="flex items-center justify-between mb-6">
                <BackButton onClick={handleBack} />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">{STEP_TITLE[step]}</h2>
            </div>

            <img className="max-h-[50vh] mx-auto mb-6"
                 src={baseCan} alt="design preview" />
        
            <h3 className="text-center mt-4">{STEP_SUBTITLE[step]}</h3>

            {/* Steps */}

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

            {step === "konto" && (
                
                    <KontoStep />

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
                        <Button text="Skippa" onClick={() => setModalOpen(true)} variant="outlined" />
                        <Button text="Gå vidare" onClick={() => setStep("konto")} variant="primary" />
                </>
            )}

            {step === "konto" && (
                <>
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
