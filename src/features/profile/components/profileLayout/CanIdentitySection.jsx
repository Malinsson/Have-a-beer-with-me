import { QRScanner } from "../../../../shared/components/QRScanner.jsx";
import { ProfileQRCode } from "../../../../shared/components/ProfileQRCode.jsx";
import { MdCheck, MdAdd } from "react-icons/md";
import { Button } from "../../../../shared/components/Button.jsx";
import { useNavigate } from "react-router-dom";

export const CanIdentitySection = ({
    profile,
    isOwnProfile,
    isSaved,
    saving,
    slug,
    department,
    shareId,
    onSave,
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="profile">{profile?.first_name} <br/></h2>
                    <h2 className="profile profile-italic">{profile?.last_name}</h2>
                    <h4 className="text-dark-blue text-2xl">{department}</h4>
                </div>

                <div className="flex flex-col gap-2">
                    <ProfileQRCode slug={slug} size={130} />
                </div>
            </div>

            <div className="flex flex-row justify-between gap-4 items-center">
                <div className="w-1/2 items-center"> 
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
                            onClick={onSave}
                        />
                    )}
                </div>
                <div className="w-1/2 text-right pr-7">
                    <p className="text-xs">ID: {shareId}</p>
                </div>
            </div>
        </div>
    )};
