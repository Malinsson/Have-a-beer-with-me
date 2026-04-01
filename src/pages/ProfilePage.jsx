import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiOutlineQrcode } from "react-icons/hi";
import { CanView } from "../components/CanView.jsx";
import { CameraView } from "../components/CameraView.jsx";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { supabase } from "../lib/supabase.js";
import { useIsGuest } from "../shared/hooks/useIsGuest.js";
import { Button } from "../components/Button.jsx";

// HTTPS is required — getUserMedia only works on secure connections. 
// It will work on localhost for development, but once live it must be 
// served over HTTPS. Most hosting providers (Vercel, Netlify etc.) handle this automatically.

export const ProfilePage = () => {
    const [userId, setUserId] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false);

    const { slug } = useParams();
    const navigate = useNavigate();
    const isGuest = useIsGuest();

    const { profile, loading, error } = useProfileInfo(slug);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        }
        getUser();
    }, []);    

    if (isGuest) return (
        <div className="container mx-auto p-4 flex flex-col items-center gap-4 mt-12">
            <p className="text-xl text-center">
                Du behöver ett konto för att se din profil.
            </p>

            <Button text="Skapa konto" onClick={() => navigate("/login")} variant="primary" />
        </div>
    );

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>Något gick fel.</p>;

    if (loading) return <p>Laddar...</p>
    if (error) return <p>Något gick fel.</p>

    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">
                {profile?.first_name} {profile?.last_name}
            </h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <CanView />
                    <img src={profile?.qr_code} alt="user QR code" />
            </section>

            {cameraOpen && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <button
                        onClick={() => setCameraOpen(false)}
                        className="text-white text-xl p-4 self-end"
                        > Stäng kamera
                    </button>
                    <CameraView />
                </div>
            )}

            <div className="fixed bottom-6 right-6 bg-blue-950 rounded-full w-16 h-16 flex items-center justify-center z-40 shadow-lg">
                <button 
                    onClick={() => setCameraOpen(true)} 
                    className="flex items-center justify-center"
                >
                    <HiOutlineQrcode className="text-white text-4xl" />
                </button>
            </div>
        </div>
    );
}