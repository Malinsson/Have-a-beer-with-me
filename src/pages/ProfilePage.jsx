import { HiOutlineQrcode } from "react-icons/hi";
import { CanView } from "../components/CanView.jsx";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";

export const ProfilePage = () => {

    const { profile, loading, error } = useProfileInfo(userId);

    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">{profile?.first_name} {profile?.last_name}</h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <CanView />
                    <img src={profile?.qr_code} alt="user QR code" />
                    <div className="fixed bottom-6 right-6 bg-blue-950 rounded-full p-3 z-40">
                        <a href="profile/{profile?.id}">
                            <HiOutlineQrcode className="text-5xl text-white" />
                        </a>
                    </div>
            </section>
        </div>
    );
}