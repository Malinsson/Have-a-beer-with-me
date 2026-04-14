import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserSlug } from "../features/profile/hooks/useUserSlug.js";
import { supabase } from "../lib/supabase.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { CanPreviewSection } from "../features/profile/components/profileLayout/CanPreviewSection.jsx";
import { CanTagSection } from "../features/profile/components/profileLayout/CanTagSection.jsx";
import { CanSocialSection } from "../features/profile/components/profileLayout/CanSocialSection.jsx";
import { CanIdentitySection } from "../features/profile/components/profileLayout/CanIdentitySection.jsx";
import { CanInfoSection } from "../features/profile/components/profileLayout/CanInfoSection.jsx";
import { CanActionSection } from "../features/profile/components/profileLayout/CanActionSection.jsx";
import { useSavedCan } from "../features/profile/hooks/useSavedCan.js";
import { LoginRedirectMessage } from "../shared/components/LoginRedirectMessage.jsx";
import { invokeProfileBootstrap } from "../features/profile/hooks/profileBootstrap.js";
import { normalizeError } from "../shared/utils/errors.js";
import { Button } from "../shared/components/Button.jsx";


export const ProfilePage = () => {
    
    const [currentUserId, setCurrentUserId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    // Get slug from URL and current user's slug for comparison
    const navigate = useNavigate();
    const { slug } = useParams();
    const mySlug = useUserSlug();
    const { saveCanToShelf } = useSaveCanToShelf();

    useEffect(() => {
        if (slug === "null" || slug === "me") {
            if (mySlug) {
                navigate(`/profile/${mySlug}`, { replace: true });
            }
        }
    }, [slug, mySlug, navigate]);

    useEffect(() => {
        if (!slug) {
            setProfile(null);
            setDesign(null);
            setCurrentUserId(null);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchProfilePageData = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data: bootstrapData, error: bootstrapError } = await invokeProfileBootstrap({ slug });

                if (!cancelled && !bootstrapError && bootstrapData?.profile) {
                    const bootstrapViewerId =
                        bootstrapData?.viewer?.id ||
                        bootstrapData?.auth?.userId ||
                        null;

                    setProfile(bootstrapData.profile || null);
                    setDesign(bootstrapData.design || bootstrapData.latestDesign || null);
                    setCurrentUserId(bootstrapViewerId);
                    setLoading(false);
                    return;
                }

                const {
                    data: { user },
                } = await supabase.auth.getUser();

                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("slug_value", slug)
                    .maybeSingle();

                if (profileError) throw profileError;

                let designData = null;
                if (profileData?.id) {
                    const { data: latestDesign, error: designError } = await supabase
                        .from("designs")
                        .select("id, name, design_data, share_id, created_at, updated_at, user_id")
                        .eq("user_id", profileData.id)
                        .not("design_data", "is", null)
                        .order("updated_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (designError) throw designError;
                    designData = latestDesign || null;
                }

                if (cancelled) return;
                setProfile(profileData || null);
                setDesign(designData);
                setCurrentUserId(user?.id || null);
            } catch (caughtError) {
                if (cancelled) return;
                setError(normalizeError(caughtError, "Kunde inte ladda profilen."));
                setProfile(null);
                setDesign(null);
                setCurrentUserId(null);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProfilePageData();

        return () => {
            cancelled = true;
        };
    }, [slug, reloadKey]);

    const { isSaved, setIsSaved, saving, setSaving } = useSavedCan(design?.share_id);
    
    const backData = design?.design_data?.back || {};
    const socialsData = backData.socials || {};

    if (loading) return <p className="text-center mt-10">Laddar profil...</p>;

    if (error) {
        return (
            <div className="text-center mt-10 px-4">
                <p className="text-red-500 mb-4">{error.message || "Något gick fel."}</p>
                <div className="mx-auto w-44">
                    <Button text="Försök igen" onClick={() => setReloadKey((key) => key + 1)} />
                </div>
            </div>
        );
    }

    if (!profile && !loading) return (
        <LoginRedirectMessage message="Kunde inte hitta profilen." />
    );

    const isOwnProfile = currentUserId && profile?.id === currentUserId;
    
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
            {loading ? (
                <p>Laddar burk...</p>
            ) : error ? (
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