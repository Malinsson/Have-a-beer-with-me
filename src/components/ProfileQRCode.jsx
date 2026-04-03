import { ReactQRCode } from '@lglab/react-qr-code'

export const ProfileQRCode = ({ slug, size = 128 }) => {
    const host = window.location.origin;
    const profileUrl = `${host}/profile/${slug}`;

    if (!slug) return null;
    
    return (
        <div 
            className="qr-wrapper bg-white inline-block rounded-lg"
            style={{ display: 'inline-block' }}
        >
            <ReactQRCode 
                value={profileUrl} 
                size={size} 
            />
        </div>
    );
}