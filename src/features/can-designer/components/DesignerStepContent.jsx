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
    front,
    back,
    onTextureSelect,
    onColorSelect,
    onFontSelect,
    onAlignmentChange,
    onImageUpload,
    onBackDescriptionChange,
    onToggleTag,
    onSocialChange,
    onSignupSuccess,
}) => {
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
                    instagram={back.socials.instagram}
                    linkedin={back.socials.linkedin}
                    github={back.socials.github}
                    onChange={onSocialChange}
                />
            )}

            {step === "konto" && !canSkipKonto && (
                <KontoStep onSignupSuccess={onSignupSuccess} />
            )}
        </>
    );
};
