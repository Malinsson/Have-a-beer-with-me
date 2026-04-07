import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { supabase } from "../lib/supabase.js";
import { Button } from "../components/Button.jsx";
import { QRScanner } from "../components/QRScanner.jsx";
import { ProfileQRCode } from "../components/ProfileQRCode.jsx";
import { MdCheck, MdAdd } from "react-icons/md";
import { useProfileDesigns } from "../features/profile/hooks/useProfileDesigns.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { CanPreviewSection } from "../features/profile/components/CanPreviewSection.jsx";
import { CanTagSection } from "../features/profile/components/CanTagSection.jsx";
import { CanSocialSection } from "../features/profile/components/CanSocialSection.jsx";


// HTTPS is required — getUserMedia only works on secure connections. 
// It will work on localhost for development, but once live it must be 
// served over HTTPS. Most hosting providers (Vercel, Netlify etc.) handle this automatically.

export const ProfilePage = () => {
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate();
    const { slug } = useParams();
    const mySlug = useUserSlug() || "guest";


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

            {designLoading ? (
                <p>Laddar burk...</p>
            ) : designError ? (
                <p>Något gick fel när burken laddades.</p>
            ) : (
                <CanPreviewSection design={design} />
            )}

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
                    

                <div className="my-8">
                    {backData.tags?.length > 0 ? (
                        <CanTagSection backData={backData} />
                    ) : (
                        <p className="text-center text-gray-400 uppercase text-xs tracking-widest">
                            Inga kompetenser valda
                        </p>
                    )}
                </div>


                <div className="mt-8 mb-6">
                    <h3>Innehållsförteckning</h3>
                    <p>{backData.description || "Ingen beskrivning tillagd."}</p>
                </div>

                    <CanSocialSection socialsData={socialsData} profile={profile} />

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