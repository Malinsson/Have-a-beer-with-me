import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { supabase } from "../lib/supabase.js";
import { useProfileDesigns } from "../features/profile/hooks/useProfileDesigns.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { CanPreviewSection } from "../features/profile/components/CanPreviewSection.jsx";
import { CanTagSection } from "../features/profile/components/CanTagSection.jsx";
import { CanSocialSection } from "../features/profile/components/CanSocialSection.jsx";
import { CanIdentitySection } from "../features/profile/components/CanIdentitySection.jsx";
import { CanInfoSection } from "../features/profile/components/CanInfoSection.jsx";
import { CanActionSection } from "../features/profile/components/CanActionSection.jsx";


export const ProfilePage = () => {
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Get slug from URL and current user's slug for comparison
    const navigate = useNavigate();
    const { slug } = useParams();
    const mySlug = useUserSlug() || "guest";

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
    
    const backData = design?.design_data?.back || {};
    const socialsData = backData.socials || {};
    
    if (loading) return <p className="text-center mt-10">Laddar...</p>;
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