import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiOutlineQrcode } from "react-icons/hi";
import { CanView } from "../components/CanView.jsx";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useIsGuest } from "../shared/hooks/useIsGuest.js";
import { Button } from "../components/Button.jsx";

export const ProfilePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isGuest = useIsGuest();

    const { profile, loading, error } = useProfileInfo(slug);

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

    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">
                {profile?.first_name} {profile?.last_name}
            </h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <CanView />
                    <img src={profile?.qr_code} alt="user QR code" />
                    <div className="fixed bottom-6 right-6 bg-blue-950 rounded-full p-3 z-40">
                        <a href={`/profile/${slug}`}>
                            <HiOutlineQrcode className="text-5xl text-white" />
                        </a>
                    </div>
            </section>
        </div>
    );
}