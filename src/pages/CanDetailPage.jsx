// This is the view when you tap on a can on the shelf on your profile.
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useDesign } from "../features/can-designer/hooks/displayCanDesign/useDesigns.js";
import { useProfileByUserId } from "../features/profile/hooks/useProfileByUserId.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { useSavedCan } from "../features/profile/hooks/useSavedCan.js";
import { CanPreviewSection } from "../features/profile/components/profileLayout/CanPreviewSection.jsx";
import { CanIdentitySection } from "../features/profile/components/profileLayout/CanIdentitySection.jsx";
import { CanTagSection } from "../features/profile/components/profileLayout/CanTagSection.jsx";
import { CanInfoSection } from "../features/profile/components/profileLayout/CanInfoSection.jsx";
import { CanSocialSection } from "../features/profile/components/profileLayout/CanSocialSection.jsx";
import { CanActionSection } from "../features/profile/components/profileLayout/CanActionSection.jsx";

export const CanDetailPage = () => {
    const navigate = useNavigate();
    const { shareId } = useParams();
    if (!shareId) return <Navigate to="/404" replace />;
    const mySlug = useUserSlug();
    const [currentUserId, setCurrentUserId] = useState(null);

    const { design, loading: designLoading, error: designError } = useDesign(shareId);
    const { profile, loading: profileLoading, error: profileError } = useProfileByUserId(design?.user_id);
    const { saveCanToShelf } = useSaveCanToShelf();
    const { isSaved, setIsSaved, saving, setSaving } = useSavedCan(design?.share_id);
    const isOwnProfile = !!currentUserId && currentUserId === design?.user_id;
    const backData = design?.design_data?.back || {};
    const socialsData = backData.socials || {};

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };

        fetchUser();
    }, []);

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

    if (designError || profileError) return <Navigate to="/404" replace />;
    if (!design || !profile) return <Navigate to="/404" replace />;

    const ownerSlug = profile?.slug_value || mySlug;
    
    return (
        <div id="top" className="container mx-auto p-4">

            {/* Beer can preview section */}
            {designLoading ? (
                <p className="text-center">Laddar burk...</p>
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
                slug={ownerSlug}
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
                    onOpenShelf={() => navigate(`/profile/${ownerSlug}/hylla`)}
                    onOpenMyCan={() => navigate(`/profile/${mySlug}`)}
                    onSaveCan={handleSave}
                    onOpenSavedShelf={() => navigate(`/profile/${mySlug}/hylla`)}
                />
            </section>
        </div>
    );
}