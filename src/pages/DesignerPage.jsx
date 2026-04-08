import { useState, useEffect, useRef } from "react";
import { useDesignStore } from "../store/designStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserSlug } from "../features/profile/hooks/useUserSlug";
import supabase from "../lib/supabase";
 
// import type { DesignerMode, Step } from "../features/can-designer/types.ts";
import { DesignerStepContent } from "../features/can-designer/components/DesignerStepContent";
import { DesignerStepActions } from "../features/can-designer/components/DesignerStepActions";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D";
import { Modal } from "../shared/components/Modal";
import { BackButton } from "../shared/components/BackButton";


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
    social: "Lägg till kontaktuppgifter",
    konto: "Skapa ett konto för att spara din burk"
};

const STEPS = ["front", "back", "info", "social", "konto"];

export const DesignerPage = () => {
    
    const [step, setStep] = useState("front");
    const [mode, setMode] = useState("image");
    const [modalOpen, setModalOpen] = useState(false);
    const [canSkipKonto, setCanSkipKonto] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const userSlug = useUserSlug();

    const timerRef = useRef(null);
    const hasHydratedRef = useRef(false);

    const front = useDesignStore((state) => state.front);
    const back = useDesignStore((state) => state.back);
    const setName = useDesignStore((state) => state.setName);
    const setFront = useDesignStore((state) => state.setFront);
    const setBack = useDesignStore((state) => state.setBack);
    const redirectSlug = location.state?.slug || userSlug || "guest";
    const previewSide = step === "front" ? "front" : "back";

    useEffect(() => {
        const syncAuthState = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCanSkipKonto(!!session && !session.user?.is_anonymous);
        };

        syncAuthState();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setCanSkipKonto(!!session && !session?.user?.is_anonymous);
        });

        const hydrateLatestDesign = async () => {
            const hasIncomingState =
                typeof location.state?.firstName === "string" ||
                typeof location.state?.lastName === "string" ||
                typeof location.state?.department === "string";

            if (hasIncomingState) {
                setName(
                    location.state?.firstName || "",
                    location.state?.lastName || "",
                    location.state?.drinkTypeLabel || ""
                );
                setFront({
                    drinkTypeId: location.state?.drinkTypeId || "",
                    drinkType: location.state?.drinkTypeLabel || "",
                });
                setBack({ department: location.state?.department || "" });
                return;
            }

            const result = await useDesignStore.getState().loadLatestDesignForCurrentUser();
            const { firstName, drinkTypeLabel, department } = location.state || {};

            if (firstName) {
                useDesignStore.getState().setName(firstName, drinkTypeLabel || "");
            }
            if (department) {
                useDesignStore.getState().setBack({ department });
            }
            if (!result.success && result.error !== "No design found" && result.error !== "User not authenticated") {
                console.log("Failed to hydrate latest design:", result.error);
            }
        };

        hydrateLatestDesign();

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
            }, 1000);
        });

        return () => {
            clearTimeout(timerRef.current);
            unsubscribe();
            authListener.subscription.unsubscribe();
        };
    }, [location.state, setBack, setFront, setName]);

    const handleTextureSelect = (textureId) => {
        setFront({ texturePreset: textureId });
    };

    const handleColorSelect = (colorHex) => {
        setFront({ textColor: colorHex });
    };

    const handleFontSelect = (fontFamily) => {
        setFront({ textFont: fontFamily });
    };

    const handleAlignmentChange = (alignment) => {
        setFront({ textAlignment: alignment });
    };

    const handleBackDescriptionChange = (description) => {
        setBack({ description });
    };

    const handleImageUpload = (imageUrl, options = {}) => {
        setFront({
            imageUrl,
            imageTransform: options.imageTransform || {
                x: 0,
                y: 0,
                scale: 1,
            },
        });
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
                ...(back?.socials || {}),
                [field]: value,
            },
        });
    };

    const finalizeDesignAndOpenModal = async () => {
        clearTimeout(timerRef.current);
        const result = await useDesignStore.getState().saveDesign("Final design");
        if (result.success) {
            setModalOpen(true);
            return;
        }

        console.error("Failed to save design:", result.error);
    };

    const handleCreateCan = async () => {
        await finalizeDesignAndOpenModal();
    };

    const handleSocialContinue = async () => {
        if (canSkipKonto) {
            await finalizeDesignAndOpenModal();
            return;
        }
        setStep("konto");
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
   
            <div className="flex items-center justify-between mb-6">
                {(step === "front") && (
                    <div className="text-center w-full">
                        <h3>{STEP_TITLE[step]}</h3>
                    </div>
                )}
                {(step !== "front" ) && (
                    <>
                        <BackButton onClick={handleBack} />
                        <h3 className="absolute left-1/2 transform -translate-x-1/2">{STEP_TITLE[step]}</h3>
                    </>
                )}
            </div>

            <div className="mb-4 max-h-40vh flex justify-center">
                <CanPreview2D side={previewSide} scale={0.85} />
            </div>
        
            <p className="bold">{STEP_SUBTITLE[step]}</p>

            {/* Steps and Content */}
            <DesignerStepContent
                step={step}
                canSkipKonto={canSkipKonto}
                mode={mode}
                onModeChange={setMode}
                front={front}
                back={back}
                onTextureSelect={handleTextureSelect}
                onColorSelect={handleColorSelect}
                onFontSelect={handleFontSelect}
                onAlignmentChange={handleAlignmentChange}
                onImageUpload={handleImageUpload}
                onBackDescriptionChange={handleBackDescriptionChange}
                onToggleTag={toggleOption}
                onSocialChange={handleSocialChange}
                onSignupSuccess={handleCreateCan}
            />

            {/* Navigation buttons */}
            <DesignerStepActions
                step={step}
                canSkipKonto={canSkipKonto}
                onSetStep={setStep}
                onSocialContinue={handleSocialContinue}
                onFinalizeAsGuest={finalizeDesignAndOpenModal}
            />
                  
            {/* Modal */}
            {modalOpen && (
                <Modal onConfirm={() => window.location.assign(`/profile/${redirectSlug}`)} />
            )}

        </div>
    );
};