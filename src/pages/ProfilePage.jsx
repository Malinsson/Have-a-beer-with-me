import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { supabase } from "../lib/supabase.js";
import { useProfileDesigns } from "../features/profile/hooks/useProfileDesigns.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { CanPreviewSection } from "../features/profile/components/profileLayout/CanPreviewSection.jsx";
import { CanTagSection } from "../features/profile/components/profileLayout/CanTagSection.jsx";
import { CanSocialSection } from "../features/profile/components/profileLayout/CanSocialSection.jsx";
import { CanIdentitySection } from "../features/profile/components/profileLayout/CanIdentitySection.jsx";
import { CanInfoSection } from "../features/profile/components/profileLayout/CanInfoSection.jsx";
import { CanActionSection } from "../features/profile/components/profileLayout/CanActionSection.jsx";
import { useSavedCan } from "../features/profile/hooks/useSavedCan.js";
import scanCanImage from "../assets/images/yrgo-can.png";


export const ProfilePage = () => {
    
    const [currentUserId, setCurrentUserId] = useState(null);
    const [countdown, setCountdown] = useState(3);

    // Get slug from URL and current user's slug for comparison
    const navigate = useNavigate();
    const { slug } = useParams();
    const mySlug = useUserSlug();

    // Redirect to own profile if slug is "me"
    const { profile, loading, error } = useProfileInfo(slug);
    const isOwnProfile = currentUserId && profile?.id === currentUserId;

    // Save can to shelf hook
    const { saveCanToShelf } = useSaveCanToShelf();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        fetchCurrentUser();
    }, []);

    // Fetch the current design for this profile
    const { design, loading: designLoading, error: designError } = useProfileDesigns(profile?.id);
    const { isSaved, setIsSaved, saving, setSaving } = useSavedCan(design?.share_id);
    
    const backData = design?.design_data?.back || {};
    const socialsData = backData.socials || {};
    
    useEffect(() => {
        if (!profile && !loading) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
    
            const redirect = setTimeout(() => {
                navigate("/login");
            }, 3000);
    
            return () => {
                clearInterval(timer);
                clearTimeout(redirect);
            };
        }
    }, [profile, loading, navigate]);

    if (loading) return <p className="text-center mt-10">Laddar profil...</p>;

    if (!profile && !loading) return (
        <div className="flex flex-col mt-12 gap-4 w-full text-center p-6">
            <h3>Du behöver ett konto för att se din profile.</h3>
            <div className="flex justify-center">
                <img 
                    src={scanCanImage}
                    alt="empty shelf" 
                    className="w-40 h-auto object-contain my-10"
                />
            </div>
            <p>Du skickas till inloggningen om <span className="bold text-xl text-yrgo-red">{countdown}</span> sekunder...</p>
        </div>
    );

    if (error) return <p className="text-center mt-10 text-red-500">Något gick fel.</p>;
    
    // Check if the current design is being saved to disable the save button
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

            {/* Beer can preview section */}
            {designLoading ? (
                <p>Laddar burk...</p>
            ) : designError ? (
                <p>Något gick fel när burken laddades.</p>
            ) : (
                <CanPreviewSection design={design} />
            )}

            <section>
                
                {/* Name, department and QR code section */}
                <CanIdentitySection 
                profile={profile}
                isOwnProfile={isOwnProfile}
                isSaved={isSaved}
                saving={saving}
                slug={slug}
                department={backData.department}
                shareId={design?.share_id}
                onSave={handleSave}

                 />

                {/* Tags section */}
                <div className="my-8">
                    {backData.tags?.length > 0 ? (
                        <CanTagSection backData={backData} />
                    ) : (
                        <p className="text-center text-gray-400 uppercase text-xs tracking-widest">
                            Inga kompetenser valda
                        </p>
                    )}
                </div>
                
                {/* Description section */}
                <CanInfoSection backData={backData} />

                {/* Socials section */}
                <CanSocialSection socialsData={socialsData} profile={profile} />

                {/* Bottom buttons section */}
                <CanActionSection
                    isOwnProfile={isOwnProfile}
                    isSaved={isSaved}
                    onEditCan={() => navigate("/design")}
                    onOpenShelf={() => navigate(`/profile/${slug}/hylla`)}
                    onOpenMyCan={() => navigate(`/profile/${mySlug}`)}
                    onSaveCan={handleSave}
                    onOpenSavedShelf={() => navigate(`/profile/${mySlug}/hylla`)}
                />
            </section>
        </div>
    );
}