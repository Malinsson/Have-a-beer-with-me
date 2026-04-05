import QRCode from "react-qr-code";

const ProfileQRCode = ({ slug, size = 128 }) => {
    const profileUrl = `/profile/${slug}`;
    
    return (
        <div className="qr-wrapper" 
            style={{ padding: '10px', background: 'white', display: 'inline-block' }}>
            <QRCode value={profileUrl} size={size} />
        </div>
    );
}

export default ProfileQRCode;