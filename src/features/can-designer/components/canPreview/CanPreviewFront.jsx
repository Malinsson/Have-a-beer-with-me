import overlay from "../../../../assets/images/overlay.png";
import { TEXT_ALIGNMENT, TEXTURES } from "../../constants";

const DEFAULT_TEXTURE_BG = "linear-gradient(135deg, #f0f0f090 0%, #e2e2e290 100%)";

const TEXTURE_SRC_BY_ID = TEXTURES.reduce((acc, texture) => {
    acc[texture.id] = texture.src;
    return acc;
}, {});


export const CanPreviewFront = ({ front, name, fontScale }) => {

    const firstName = (name.firstName || "").trim();
    const firstNameEndsWithS = /s$/i.test(firstName);
    const textAlignClass = TEXT_ALIGNMENT[front.textAlignment] || TEXT_ALIGNMENT.center;

    const textureSrc = TEXTURE_SRC_BY_ID[front.texturePreset] || null;
    const imageTransform = {
        x: front.imageTransform?.x || 0,
        y: front.imageTransform?.y || 0,
        scale: front.imageTransform?.scale || 1,
    };
    const imageLayerStyle = {
        transform: `translate(${imageTransform.x}%, ${imageTransform.y}%) scale(${imageTransform.scale})`,
        transformOrigin: "center center",
    };


    return (
        <div>
            <div className="absolute inset-0 bg-black/10" />

                {/* Text layer */}
                <div className={`absolute w-full h-full p-3 z-20 flex ${textAlignClass}`}>
                    <p
                        style={{ 
                            color: front.textColor, 
                            fontFamily: front.textFont, 
                            fontSize: `${1.5 * fontScale}rem`,
                            lineHeight: 0.7, 
                            fontWeight: front.textFont === "Inter, sans-serif" ? 600 : 400 
                        }}
                    >
                        {firstName && (
                            <>
                                {firstName}
                                {firstNameEndsWithS ? (
                                    "'"
                                ) : (
                                    <>
                                        {"'"}
                                        <span className="text-[1em]" style={{ color: front.textColor, fontFamily: front.textFont, fontWeight: front.textFont === "Inter, sans-serif" || front.textFont === "Bitcount Single, sans-serif" ? 600 : 400 }}>
                                            s
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                        <br />
                        {front.drinkType}
                    </p>
                </div>

            {/* Texture layer */}
            {textureSrc ? (
                <img
                    src={textureSrc}
                    alt="Texture"
                    className="absolute inset-0 w-full h-full object-cover z-5 pointer-events-none"
                />
            ) : (
                <div className="absolute inset-0 z-5" style={{ background: DEFAULT_TEXTURE_BG }} />
            )}
                <img
                    src={overlay}
                    alt="Overlay"
                    className="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none"
                    
                />

            {front.imageUrl && (
                <>
                    <img
                    src={front.imageUrl}
                    alt="Uploaded label"
                    className="absolute inset-0 w-full h-full object-contain z-15 select-none pointer-events-none"
                    style={imageLayerStyle}
                    />
                </>
            )}
            </div>
        
    )};