import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useIsGuest } from "../shared/hooks/useIsGuest.js";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { supabase } from "../lib/supabase.js";
import { Button } from "../components/Button.jsx";
import { QRScanner } from "../components/QRScanner.jsx";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";
import { useDesignStore } from "../store/designStore.js";
import { ProfileQRCode } from "../components/ProfileQRCode.jsx";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";
import { SiInstagram, SiGithub } from "react-icons/si";
import { CiLinkedin } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MdCheck, MdAdd } from "react-icons/md";
import { useProfileDesigns } from "../features/profile/hooks/useProfileDesigns.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";

import TagRed from "../assets/images/tags/tag-red.svg";
import TagGreen from "../assets/images/tags/tag-green.svg";
import TagBlue from "../assets/images/tags/tag-blue.svg";
import { getTagLabelById } from "../features/can-designer/constants.js";

// HTTPS is required — getUserMedia only works on secure connections. 
// It will work on localhost for development, but once live it must be 
// served over HTTPS. Most hosting providers (Vercel, Netlify etc.) handle this automatically.

const SOCIAL_CONFIG = [
    { key: 'linkedin', label: 'LinkedIn', Icon: CiLinkedin, baseUrl: "https://www.linkedin.com/in/" },
    { key: 'instagram', label: 'Instagram', Icon: SiInstagram, baseUrl: "https://www.instagram.com/" },
    { key: 'github', label: 'Github', Icon: SiGithub, baseUrl: "https://github.com/" },
];

const TAG_ASSETS = [TagRed, TagGreen, TagBlue];

export const ProfilePage = () => {
    const [previewSide, setPreviewSide] = useState("front");
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate();
    const { slug } = useParams();
    const mySlug = useUserSlug();


    const { profile, loading, error } = useProfileInfo(slug);
    const { design, loading: designLoading, error: designError } = useProfileDesigns(profile?.id);
    const { saveCanToShelf, savingDesignId } = useSaveCanToShelf();

    const isOwnProfile = currentUserId && profile?.id === currentUserId;

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };

        fetchCurrentUser();
    }, []);

    if (loading) return <p className="text-center mt-10">Laddar...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Något gick fel.</p>;

    const backData = design?.design_data?.back || {};
    const socialsData = backData.socials || {};

    const handleSave = async () => {
        if (!design?.share_id) return;
        setSaving(true);
        const result = await saveCanToShelf({
            designId: design.id,
            shareId: design.share_id,
        });
        if (result?.success) {
            setIsSaved(true);
        }
        setSaving(false);
    };

    return (
        <div id="top" className="container mx-auto p-4">

            <section className="flex flex-col">

                {designLoading ? (
                    <p>Laddar burk...</p>
                ) : designError ? (
                    <p>Något gick fel när burken laddades.</p>
                ) : design ? (
                    <div className="max-w-xl mx-auto w-full">

                        <article className="p-4 bg-white/80 flex flex-col gap-4" >
                            
                            <CanPreview2D side={previewSide} design={design.design_data} />
                            
                        </article>
                    </div>
                ) : (
                    <p>Ingen burk hittades för den här profilen.</p>
                )}
                <div className="flex items-center gap-16 mx-auto my-4">
                    <a onClick={() => setPreviewSide("front")} >
                        <MdOutlineArrowBackIosNew />
                    </a>
                    <a onClick={() => setPreviewSide("back")}>
                        <MdOutlineArrowForwardIos />
                    </a>
                </div>
            </section>

            <section>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="profile">{profile?.first_name} <br/></h2>
                        <h2 className="profile profile-italic">{profile?.last_name}</h2>
                        <h4 className="text-dark-blue text-2xl">{backData.department}</h4>

                        {isOwnProfile ? (
                            <QRScanner 
                                text="Skanna" 
                                variant="outlined" 
                                onScan={(data) => {
                                    const url = new URL(data);
                                    navigate(url.pathname);
                                }}
                            />
                        ) : (
                            <Button
                                text={isSaved ? "Sparad" : "Spara burk"}
                                icon={isSaved ? MdCheck : MdAdd}
                                variant="outlined"
                                disabled={isSaved || saving}
                                onClick={handleSave}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <ProfileQRCode slug={slug} size={100} />
                        <p className="text-xs">ID: {design?.share_id}</p>
                    </div>
                </div>
                <div className="mt-8 mb-6">
                    <h3>Innehållsförteckning</h3>
                    <p>{backData.description || "Ingen beskrivning tillagd."}</p>
                </div>
                <div className="flex gap-4 mb-8">
                    {backData.tags?.slice(0, 3).map((tagId, index) => {
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
                {!backData.tags?.length && (
                    <p className="text-center text-gray-400 uppercase text-xs tracking-widest">
                        Inga kompetenser valda
                    </p>
                )}
                <div className="flex flex-col gap-4 mb-12 px-2 max-w-sm">
                    {SOCIAL_CONFIG.map((config) => {
                        
                        const username = socialsData[config.key];
                        if (!username) return null;

                        const { Icon, baseUrl } = config;
                        
                        return (
                            <a 
                                key={config.key}
                                href={`${config.baseUrl}${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 hover:opacity-70 transition-opacity"
                            >
                                <Icon className="text-3xl flex-shrink-0" />
                                <div>
                                    <span>
                                        {username}
                                    </span>
                                </div>
                                <MdOutlineArrowOutward className="text-2xl text-black" />
                            </a>
                        );
                    })}
                    {profile?.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-4 hover:opacity-70">
                            <HiOutlineMail className="text-3xl text-black flex-shrink-0" />
                            <div className="flex-grow">
                                <span>{profile.email}</span>
                            </div>
                            <MdOutlineArrowOutward className="text-2xl text-black" />
                        </a>
                    )}
                </div>

                <div className="flex gap-4 mt-6">
                    {isOwnProfile ? (
                        <>
                            <Button 
                                text="Editera burk" 
                                onClick={() => navigate("/design")} 
                                variant="outlined"
                                showIcon={false}
                            />
                            <Button 
                                text="Barhyllan" 
                                onClick={() => navigate(`/profile/${slug}/hylla`)} 
                                showIcon={false}
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                text="Min burk"
                                onClick={() => navigate(`/profile/${mySlug}`)}
                                variant="outlined"
                                showIcon={false}
                            />
                            <Button
                                text={isSaved ? "Barhyllan" : "Spara burk"}
                                onClick={() => isSaved
                                ? navigate(`/profile/${mySlug}/hylla`)
                                : handleSave()
                                }
                                showIcon={false}
                            />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}