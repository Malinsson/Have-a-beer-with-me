import { getTagLabelById } from "../../constants";
import { ProfileQRCode } from "../../../../shared/components/ProfileQRCode.jsx";
import logo from "../../../../assets/images/logo/yrgo.png";

import TagRed from "../../../../assets/images/tags/tag-red.svg";
import TagGreen from "../../../../assets/images/tags/tag-green.svg";
import TagBlue from "../../../../assets/images/tags/tag-blue.svg";

import { SiInstagram, SiGithub } from "react-icons/si";
import { CiLinkedin } from "react-icons/ci";

const TAG_ASSETS = [TagRed, TagGreen, TagBlue];

const SOCIAL_CONFIG = [
    { key: 'linkedin', label: 'LinkedIn', Icon: CiLinkedin },
    { key: 'instagram', label: 'Instagram', Icon: SiInstagram },
    { key: 'github', label: 'Github', Icon: SiGithub },
];

const getAdaptiveNameSize = (value) => {
    const length = (value || "").trim().length;
    if (length <= 10) return "1.25rem";
    if (length <= 14) return "1rem";
    if (length <= 18) return "0.875rem";
    return "0.78rem";
};


export const CanPreviewBack = ({ back = {tags: [], socials: {}}, profile, effectiveSlug }) => {
    
    const socialsData = back?.socials || {};
    const backFirstNameSize = getAdaptiveNameSize(profile?.first_name);
    const backLastNameSize = getAdaptiveNameSize(profile?.last_name);

    return (
            <div className=" absolute bg-white/80 w-full h-full inset-0 p-2 flex flex-col">
                <div className="flex justify-between w-full">

                    <div className="flex flex-col leading-tight w-full max-w-[80%]">
                        <h2 className="profileCan truncate" style={{ fontSize: backFirstNameSize, lineHeight: 1.05 }}>
                            {profile?.first_name}
                        </h2>
                        <h2 className="profileCan profile-italic truncate" style={{ fontSize: backLastNameSize, lineHeight: 1.05 }}>
                            {profile?.last_name}
                        </h2>
                        <h4 className="text-dark-blue text-lg">{back.department}</h4>
                    </div>

                    <img src={logo} alt="Yrgo Logo" className="w-8 h-8" />
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-[10px] pb-1">Innehållsförteckning</h3>
                    <p className="text-[8px] h-12 overflow-hidden">{back.description || "Ingen beskrivning tillagd."}</p>
                </div>

                <div className="flex justify-between mt-auto mb-1 w-full min-w-0 h-20">
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
                        <ProfileQRCode slug={effectiveSlug} size={65} />
                    </div>
                </div>
            </div>
    )};