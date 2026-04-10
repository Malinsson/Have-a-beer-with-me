import { FrontStep } from "../steps/FrontStep";
import { BackStep } from "../steps/BackStep";
import { InfoStep } from "../steps/InfoStep";
import { SocialStep } from "../steps/SocialStep";
import { KontoStep } from "../steps/KontoStep";

export const DesignerStepContent = ({
    step,
    canSkipKonto,
    mode,
    onModeChange,
    authMode,
    onAuthModeChange,
    front,
    back,
    onTextureSelect,
    onColorSelect,
    onFontSelect,
    onAlignmentChange,
    onImageUpload,
    onRemoveImage,
    onBackDescriptionChange,
    onToggleTag,
    onSocialChange,
    onSignupSuccess,
}) => {
    const socials = back?.socials || {};

    return (
        <>
            {step === "front" && (
                <FrontStep
                    mode={mode}
                    onModeChange={onModeChange}
                    selectedTexture={front.texturePreset}
                    selectedColor={front.textColor}
                    selectedFont={front.textFont}
                    selectedAlignment={front.textAlignment}
                    onTextureSelect={onTextureSelect}
                    onColorSelect={onColorSelect}
                    onFontSelect={onFontSelect}
                    onAlignmentChange={onAlignmentChange}
                    onImageUpload={onImageUpload}
                    hasImage={!!front.imageUrl}
                    onRemoveImage={onRemoveImage}
                />
            )}

            {step === "back" && (
                <BackStep
                    value={back.description}
                    onChange={onBackDescriptionChange}
                />
            )}

            {step === "info" && (
                <InfoStep
                    selected={new Set(back.tags)}
                    onToggle={onToggleTag}
                />
            )}

            {step === "social" && (
                <SocialStep
                    instagram={socials.instagram || ""}
                    linkedin={socials.linkedin || ""}
                    github={socials.github || ""}
                    onChange={onSocialChange}
                />
            )}

            {step === "konto" && !canSkipKonto && (
                <KontoStep 
                    authMode={authMode} 
                    onAuthModeChange={onAuthModeChange} 
                    onSignupSuccess={onSignupSuccess} 
                />
            )}
        </>
    );
};
