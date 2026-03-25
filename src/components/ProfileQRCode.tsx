import React from "react";
import QRCode from "react-qr-code";

interface ProfileQRCodeProps {
  userId: string;
  size?: number;
}

const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({ userId, size = 128 }) => {
    const profileUrl = `https://example.com/user/${userId}`;
    
    return (
        <div className="qr-wrapper" 
            style={{ padding: '10px', background: 'white', display: 'inline-block' }}>
            <QRCode value={profileUrl} size={size} />
        </div>
    );
}

export default ProfileQRCode;