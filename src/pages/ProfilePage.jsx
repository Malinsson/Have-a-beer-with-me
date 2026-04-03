import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useIsGuest } from "../shared/hooks/useIsGuest.js";
import { Button } from "../components/Button.jsx";
import { QRScanner } from "../components/QRScanner.jsx";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";
import { useDesignStore } from "../store/designStore.js";

// HTTPS is required — getUserMedia only works on secure connections. 
// It will work on localhost for development, but once live it must be 
// served over HTTPS. Most hosting providers (Vercel, Netlify etc.) handle this automatically.

export const ProfilePage = () => {
    const [profileDesign, setProfileDesign] = useState(null);
    const [designLoading, setDesignLoading] = useState(true);
    const [previewSide, setPreviewSide] = useState("front");

    const { slug } = useParams();
    const navigate = useNavigate();
    const isGuest = useIsGuest();

    const { profile, loading, error } = useProfileInfo(slug);

    useEffect(() => {
        if (!profile?.id) return;

        let cancelled = false;

        const fetchLatestDesign = async () => {
            setDesignLoading(true);

            const result = await useDesignStore.getState().getLatestDesignDataByUserId(profile.id);

            if (cancelled) return;

            if (!result.success) {
                console.error("Failed to load profile design:", result.error);
                setProfileDesign(null);
            } else {
                setProfileDesign(result.designData || null);
            }

            setDesignLoading(false);
        };

        fetchLatestDesign();

        return () => {
            cancelled = true;
        };
    }, [profile?.id]);

    if (isGuest) return (
        <div className="container mx-auto p-4 flex flex-col items-center gap-4 mt-12">
            <p className="text-xl text-center">
                Du behöver ett konto för att se din profil.
            </p>

            <Button text="Skapa konto" onClick={() => navigate("/login")} />
        </div>
    );

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>Något gick fel.</p>;

    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">
                {profile?.first_name} {profile?.last_name}
            </h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">

                {designLoading ? (
                    <p>Laddar burk...</p>
                ) : (
                    <CanPreview2D side={previewSide} design={profileDesign} />
                )}
                <div className="flex items-center gap-2">
                    <Button
                        variant={previewSide === "front" ? "primary" : "outlined"}
                        onClick={() => setPreviewSide("front")}
                    />
                    <Button
                        variant={previewSide === "back" ? "primary" : "outlined"}
                        onClick={() => setPreviewSide("back")}
                    />
                </div>

            </section>

                <img src={profile?.qr_code} alt="user QR code" />
            <QRScanner 
                text="Skanna" 
                variant="outlined" 
                onScan={(data) => navigate(`/profile/${data}`)} 
            />
        </div>
    );
}