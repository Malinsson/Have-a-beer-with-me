import { useParams } from "react-router-dom";
import { useDesignStore } from "../../../store/designStore";
import { useProfileInfo } from "../../profile/hooks/useProfileInfo";
import { useUserSlug } from "../../profile/hooks/useUserSlug";

import baseCan from "../../../assets/images/baseCan.png";
import logo from "../../../assets/images/yrgo.png";

import TagRed from "../../../assets/images/tags/tag-red.svg";
import TagGreen from "../../../assets/images/tags/tag-green.svg";
import TagBlue from "../../../assets/images/tags/tag-blue.svg";

import { TAGS, TEXT_ALIGNMENT, getTagLabelById } from "../constants";
import { ProfileQRCode } from "../../../components/ProfileQRCode.jsx";
import { QRScanner } from "../../../components/QRScanner.jsx";

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

export const CanPreview2D = ({ side = "front", design = null, scale = 1 }) => {
    const { slug } = useParams();
    const mySlug = useUserSlug();
    const socialsData = profile?.socials || {};

    const nameFromStore = useDesignStore((state) => state.name);
    const frontFromStore = useDesignStore((state) => state.front);
    const backFromStore = useDesignStore((state) => state.back);
    const { profile, loading, error } = useProfileInfo(slug);

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
        ? backFromStore
        : {
              tags: [],
              description: "",
              department: "",
              ...(design?.back || {}),
          };

    const tagLookup = TAGS.flatMap((group) => group.items).reduce((acc, tag) => {
        acc[tag.id] = tag.label;
        return acc;
    }, {});

    const textureBackground = TEXTURE_STYLES[front.texturePreset] || TEXTURE_STYLES.default;
    const textAlignClass = TEXT_ALIGNMENT[front.textAlignment] || TEXT_ALIGNMENT.center;
    const imageTransform = {
        x: front.imageTransform?.x || 0,
        y: front.imageTransform?.y || 0,
        scale: front.imageTransform?.scale || 1,
    };

    const firstName = (name.firstName || "").trim();
    const firstNamePossessive = firstName
    ? `${firstName}${/s$/i.test(firstName) ? "'" : "'s"}`
    : "";

    const isFrontSide = side === "front";

    return (
        <div className="relative max-w-45 mx-auto" style={{ maxWidth: `${180 * scale}px` }}>
            <img src={baseCan} alt="Can template" className="w-full h-auto object-contain" />

            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[98%] h-[72%] overflow-hidden">
            
                {isFrontSide && (
                <div>
                    <div className="absolute inset-0 bg-black/10" />

                        <div className={`absolute w-full h-full p-3 z-50 flex ${textAlignClass}`}>
                            <p
                                className="leading-tight text-2xl"
                                style={{ color: front.textColor, fontFamily: front.textFont, fontSize: `${1.5 * scale}rem`, }}
                            >
                                {firstNamePossessive}
                                <br />
                                {name.drinkType}
                            </p>
                        </div>

                    
                    <div className="absolute inset-0 z-5" style={{ background: textureBackground }} />

                    {front.imageUrl && (
                        <img
                        src={front.imageUrl}
                        alt="Uploaded label"
                        className="absolute inset-0 w-full h-full object-cover z-10 select-none pointer-events-none"
                        style={{
                            transform: `translate(${imageTransform.x}%, ${imageTransform.y}%) scale(${imageTransform.scale})`,
                            transformOrigin: "center center",
                        }}
                        />
                    )}
                    </div>

                )}

                {!isFrontSide &&(
                    <div className=" absolute bg-white/80 border-4 border-yrgo-red my-[5%] mx-[10%] inset-0 p-2 flex flex-col items-center justify-between">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex flex-col leading-tight">
                                <h2 className="profile">{profile?.first_name}</h2>
                                <h2 className="profile profile-italic">{profile?.last_name}</h2>
                                <h5 className="text-dark-blue text-2xl">{back.department}</h5>
                            </div>
                            <img src={logo} alt="Yrgo Logo" className="w-6 h-6" />
                        </div>

                        <div className="flex flex-col gap-2 items-center">
                            <ProfileQRCode slug={slug} size={100} />
                            <p className="text-xs">330 ML</p>
                        </div>
                        
                        <div className="mt-8 mb-6">
                            <h3>Innehållsförteckning</h3>
                            <p>{back.description || "Ingen beskrivning tillagd."}</p>
                        </div>

                        <div className="flex gap-4 mb-8">
                            {back.tags?.slice(0, 3).map((tagId, index) => {
                                const label = getTagLabelById(tagId);
                                
                                return (
                                    <div key={tagId} className="flex flex-col items-center gap-2">
                                        <span className="text-sm uppercase tracking-tighter">
                                            {label}
                                        </span>
                                        <div className="w-8 h-8">
                                            <img 
                                                src={TAG_ASSETS[index]} 
                                                alt={`${label} tag`} 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!back.tags?.length && (
                            <p className="text-center text-gray-400 uppercase text-xs tracking-widest">
                                Inga kompetenser valda
                            </p>
                        )}

                        <div className="flex flex-col gap-4 mb-12 px-2 max-w-sm">
                            {SOCIAL_CONFIG.map((config) => {
                                const username = socialsData[config.key];
                                if (!username) return null;
                                const { Icon } = config;
                                
                                return (
                                    <div>
                                        {Icon && <Icon className="w-3 h-3" />}
                                        <span className="text-[9px] truncate">{username}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};