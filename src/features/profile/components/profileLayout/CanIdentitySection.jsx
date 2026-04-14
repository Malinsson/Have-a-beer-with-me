import { QRScanner } from "../../../../shared/components/QRScanner.jsx";
import { ProfileQRCode } from "../../../../shared/components/ProfileQRCode.jsx";
import { MdCheck, MdAdd } from "react-icons/md";
import { Button } from "../../../../shared/components/Button.jsx";
import { useNavigate } from "react-router-dom";


const getAdaptiveNameSize = (length) => {
    const safeLength = Number.isFinite(length) ? length : 0;
    if (safeLength <= 10) return "2rem";
    if (safeLength <= 14) return "1.7rem";
    if (safeLength <= 18) return "1.3rem";
    return "1rem";
};

const getLongestWordLength = (...values) => {
    return values
        .flatMap((value) => String(value || "").trim().split(/[\s-]+/))
        .filter(Boolean)
        .reduce((max, word) => Math.max(max, word.length), 0);
};


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
    
    const longestWordLength = getLongestWordLength(
        profile?.first_name,
        profile?.last_name,
    );

    const maxFontSize = getAdaptiveNameSize(longestWordLength);
    const maxDepartmentSize = getAdaptiveNameSize(String(department || "").length);
    

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">

                <div className="flex flex-col gap-2 truncate justify-center">
                    <h2 className="profile" style={{ fontSize: maxFontSize, lineHeight: 1.05 }}>
                        {profile?.first_name} <br/>
                    </h2>
                    <h2 className="profile profile-italic" style={{ fontSize: maxFontSize, lineHeight: 1.05 }}>
                        {profile?.last_name}
                    </h2>
                    <h4 className="text-dark-blue text-wrap" style={{ fontSize: maxDepartmentSize }}>
                        {department}
                    </h4>
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
