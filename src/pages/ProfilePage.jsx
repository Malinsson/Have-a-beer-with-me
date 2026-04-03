import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { Button } from "../components/Button.jsx";
import { QRScanner } from "../components/QRScanner.jsx";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";
import { supabase } from "../lib/supabase.js";
import { useProfileDesigns } from "../features/profile/hooks/useProfileDesigns.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";

// HTTPS is required — getUserMedia only works on secure connections. 
// It will work on localhost for development, but once live it must be 
// served over HTTPS. Most hosting providers (Vercel, Netlify etc.) handle this automatically.

export const ProfilePage = () => {
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate();

    const { slug } = useParams();
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

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>Något gick fel.</p>;

    return (
        <div id="top" className="container mx-auto p-4">

            <section className="flex flex-col gap-6">

                {designLoading ? (
                    <p>Laddar burk...</p>
                ) : designError ? (
                    <p>Något gick fel när burken laddades.</p>
                ) : design ? (
                    <div className="max-w-xl mx-auto w-full">
                        <article
                            className="p-4 bg-white/80 flex flex-col gap-4"
                        >
                            
                            <CanPreview2D side="front" design={design.design_data} />
                            

                            <div className="flex flex-col gap-2">
                                                <h2 className="text-center text-3xl font-normal">
                {profile?.first_name} {profile?.last_name}
            </h2>
                                <p className="text-sm text-dark-gray">
                                    {design.design_data?.back?.department || ""}
                                </p>
                            </div>
                        </article>
                            {!isOwnProfile && (
                                <Button
                                    text={savingDesignId === design.id ? "Sparar..." : "Lägg till i min ölhylla"}
                                    variant="outlined"
                                    showIcon={false}
                                    disabled={savingDesignId === design.id}
                                    onClick={async () => {
                                        await saveCanToShelf({
                                            designId: design.id,
                                            shareId: design.share_id,
                                        });
                                    }}
                                />
                            )}
                    </div>
                ) : (
                    <p>Ingen burk hittades för den här profilen.</p>
                )}

            </section>

                <img src={profile?.qr_code} alt="user QR code" />
                <p className="underline text-gray-700">{design?.share_id}</p>
            <QRScanner 
                text="Skanna" 
                variant="outlined" 
                onScan={(data) => navigate(`/profile/${data}`)} 
            />
        </div>
    );
}