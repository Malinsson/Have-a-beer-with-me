import { useParams } from "react-router-dom";
import { useDesignStore } from "../../../store/designStore";
import { useProfileInfo } from "../../profile/hooks/useProfileInfo";
import { useUserSlug } from "../../profile/hooks/useUserSlug";

import baseCan from "../../../assets/images/baseCan.png";
import logo from "../../../assets/images/yrgo.png";
import overlay from "../../../assets/images/overlay.png";

import TagRed from "../../../assets/images/tags/tag-red.svg";
import TagGreen from "../../../assets/images/tags/tag-green.svg";
import TagBlue from "../../../assets/images/tags/tag-blue.svg";

import { TAGS, TEXT_ALIGNMENT, getTagLabelById } from "../constants";
import { ProfileQRCode } from "../../../components/ProfileQRCode.jsx";

import { SiInstagram, SiGithub } from "react-icons/si";
import { CiLinkedin } from "react-icons/ci";

const TAG_ASSETS = [TagRed, TagGreen, TagBlue];

const TEXTURE_STYLES = {
    default: "linear-gradient(135deg, #f0f0f090 0%, #e2e2e290 100%)",
    "texture-1": "repeating-linear-gradient(135deg, #f7f7f790 0px, #f7f7f790 8px, #ececec90 8px, #ececec90 16px)",
    "texture-2": "radial-gradient(circle at 20% 20%, #0c8e4090 0%, #32adaf7f 40%, #1fa8ca90 100%)",
    "texture-3": "linear-gradient(180deg, #b126269d 0%, #250d0d90 55%, #95898989 100%)",
    "texture-4": "repeating-linear-gradient(90deg, #f2f2f290 0px, #f2f2f290 6px, #e4e4e490 6px, #e4e4e490 12px)",
};

const SOCIAL_CONFIG = [
    { key: 'linkedin', label: 'LinkedIn', Icon: CiLinkedin },
    { key: 'instagram', label: 'Instagram', Icon: SiInstagram },
    { key: 'github', label: 'Github', Icon: SiGithub },
];

export const CanPreview2D = ({ side = "front", design = null, scale = 1, textScale = null }) => {
    const { slug: routeSlug } = useParams();
    const userSlug = useUserSlug();
    const effectiveSlug = routeSlug || userSlug || null;
    const { profile } = useProfileInfo(effectiveSlug);
    const nameFromStore = useDesignStore((state) => state.name);
    const frontFromStore = useDesignStore((state) => state.front);
    const backFromStore = useDesignStore((state) => state.back);
    const fontScale = textScale !== null ? textScale : scale;

    const useStoreData = !design;
    
    const name = useStoreData ? nameFromStore : { firstName: "", drinkType: "", ...(design?.name || {}) };
    const front = useStoreData
        ? frontFromStore
        : {
              imageUrl: null,
              imageTransform: { x: 0, y: 0, scale: 1 },
              texturePreset: "default",
              textColor: "#000000",
              textFont: "Inter, sans-serif",
              textAlignment: "center",
              ...(design?.front || {}),
          };
    const back = useStoreData
        ? {
              tags: [],
              description: "",
              department: "",
              socials: {},
              ...(backFromStore || {}),
          }
        : {
              tags: [],
              description: "",
              department: "",
              socials: {},
              ...(design?.back || {}),
          };

    const textureBackground = TEXTURE_STYLES[front.texturePreset] || TEXTURE_STYLES.default;
    const textAlignClass = TEXT_ALIGNMENT[front.textAlignment] || TEXT_ALIGNMENT.center;
    const imageTransform = {
        x: front.imageTransform?.x || 0,
        y: front.imageTransform?.y || 0,
        scale: front.imageTransform?.scale || 1,
    };
    const imageLayerStyle = {
        transform: `translate(${imageTransform.x}%, ${imageTransform.y}%) scale(${imageTransform.scale})`,
        transformOrigin: "center center",
    };

    //Bottom curve
    const labelClipStyle = {
        borderTopLeftRadius: "48% 1%",
        borderTopRightRadius: "48% 1%",
        borderBottomLeftRadius: "48% 3%",
        borderBottomRightRadius: "48% 3%",
    };

    const firstName = (name.firstName || "").trim();
    const firstNameEndsWithS = /s$/i.test(firstName);

    const isFrontSide = side === "front";
    const socialsData = back?.socials || {};

    return (
        <div className="relative max-w-45 mx-auto" style={{ maxWidth: `${180 * scale}px` }}>
            <img src={baseCan} alt="Can template" className="w-full h-auto object-contain" />

            {/* Label area */}
            <div
                className="absolute left-1/2 top-[18.5%] -translate-x-1/2 w-[98%] h-[75%] overflow-hidden"
                style={labelClipStyle}
            >
            
                {isFrontSide && (
                <div>
                    <div className="absolute inset-0 bg-black/10" />

                        {/* Text layer */}
                        <div className={`absolute w-full h-full p-3 z-50 flex ${textAlignClass}`}>
                            <p
                                className="leading-tight text-2xl"
                                style={{ 
                                    color: front.textColor, 
                                    fontFamily: front.textFont, 
                                    fontSize: `${1.5 * fontScale}rem`, 
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
                                                <span className="text-[1em]" style={{ color: front.textColor, fontFamily: front.textFont, fontWeight: front.textFont === "Inter, sans-serif" ? 600 : 400 }}>
                                                    s
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                                <br />
                                {name.drinkType}
                            </p>
                        </div>

                    {/* Texture layer */}
                    <div className="absolute inset-0 z-5" style={{ background: textureBackground }} />
                        <img
                            src={overlay}
                            alt="Overlay"
                            className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none"
                            
                        />

                    {front.imageUrl && (
                        <>
                            <img
                            src={front.imageUrl}
                            alt="Uploaded label"
                            className="absolute inset-0 w-full h-full object-cover z-10 select-none pointer-events-none"
                            style={imageLayerStyle}
                            />
                        </>
                    )}
                    </div>

                )}

                {/* Back side content */}
                {!isFrontSide &&(
                    <div className=" absolute bg-white/80 w-full h-full inset-0 p-2 flex flex-col">
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col leading-tight">
                                <h2 className="profileCan">{profile?.first_name}</h2>
                                <h2 className="profileCan profile-italic">{profile?.last_name}</h2>
                                <h4 className="text-dark-blue text-lg">{back.department}</h4>
                            </div>
                            <img src={logo} alt="Yrgo Logo" className="w-8 h-8" />
                        </div>

                        {/* Description */}
                        <div className="">
                            <h3 className="text-[10px] pb-1">Innehållsförteckning</h3>
                            <p className="text-[7px] h-8 overflow-hidden">{back.description || "Ingen beskrivning tillagd."}</p>
                        </div>

                        <div className="flex justify-between mt-2 w-full min-w-0 gap-2">
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <div className="flex gap-1">

                                    {/* Show 3 tags max */}
                                    {back.tags?.slice(0, 3).map((tagId, index) => {
                                        const label = getTagLabelById(tagId);
                                        
                                        return (
                                            <div key={tagId} className="flex flex-col items-center gap-1">
                                                <span className="text-[7px] uppercase tracking-tighter">
                                                    {label}
                                                </span>
                                                <div className="w-4 h-4">
                                                    <img 
                                                        src={TAG_ASSETS[index]} 
                                                        alt={`${label} tag`} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {!back.tags?.length && (
                                        <p className="uppercase text-[7px] tracking-widest mt-1">
                                            Inga kompetenser valda
                                        </p>
                                    )}
                                </div>
                                
                                {/* Social media handles */}
                                <div className="flex flex-col gap-1 pl-1 min-w-0 w-full">
                                    {SOCIAL_CONFIG.map((config) => {
                                        const username = socialsData[config.key];
                                        if (!username) return null;
                                        const { Icon } = config;
                                        
                                        return (
                                            <div key={config.key} className="flex items-center gap-1 min-w-0 w-full">
                                                {Icon && <Icon className="w-3 h-3 shrink-0" />}
                                                <span className="text-[8px] truncate min-w-0 block w-full">{username}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col items-center shrink-0 w-15">
                                <p className="text-[7px] self-end pr-2">330 ML</p>
                                <ProfileQRCode slug={effectiveSlug} size={60} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};