import QRCodeModule, { QRCode as NamedQRCode } from "react-qr-code";
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabase'


const QRCodeComponent = NamedQRCode || QRCodeModule;

export const ProfileQRCode = ({ designId, size = 128 }) => {

    const [sharedUrl, setSharedUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true

        const fetchSharedUrl = async () => {
            if (!designId) {
                if (isMounted) {
                    setSharedUrl(null)
                    setError(null)
                }
                return
            }

            if (isMounted) {
                setIsLoading(true)
                setError(null)
            }

            if (!supabase) {
                if (isMounted) {
                    setError('Supabase är inte konfigurerat.')
                    setIsLoading(false)
                }
                return
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                if (isMounted) {
                    setError('Användaren är inte inloggad.')
                    setIsLoading(false)
                }
                return
            }

            const { data, error: shareError } = await supabase
                .from('designs')
                .select('share_id')
                .eq('id', designId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (shareError) {
                console.error('Error sharing design:', shareError)
                if (isMounted) {
                    setError('Kunde inte hämta delningslänk för designen.')
                    setIsLoading(false)
                }
                return
            }

            if (!data?.share_id) {
                if (isMounted) {
                    setError('Designen saknar share_id och kan inte delas ännu.')
                    setIsLoading(false)
                }
                return
            }

            const url = `${window.location.origin}/share/${data.share_id}`
            if (isMounted) {
                setSharedUrl(url)
                setIsLoading(false)
            }
        }

        fetchSharedUrl()

        return () => {
            isMounted = false
        }
    }, [designId])

    return (
        <div className="qr-wrapper"
            style={{ padding: '10px', background: 'white', display: 'inline-block' }}>
            {isLoading && <p>Skapar delningslänk…</p>}

            {error && <p role="alert">{error}</p>}

            {sharedUrl && (
                <>
                    <QRCodeComponent value={sharedUrl} size={size} />
                    <p>{sharedUrl}</p>
                </>
            )}
        </div>
    );
}

export default ProfileQRCode;