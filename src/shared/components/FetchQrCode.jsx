import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";


export const CanView = ({ frontImg, backImg }) => {
    const [QrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQrCode = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('beer_designs') // Name of your table
                .select('qr_img, qr_url') // Your column names
                .eq('id', canId)
                .single();
            if (error) {
                console.error("Error fetching can QR code:", error);
            } else {
                setQrData(data);
            }
            setLoading(false);
        };

        if (canId) fetchQrCode();
    });

    if (loading) return <p>Hämtar QR-kod...</p>;
    if (!QrData) return <p>Ingen QR-kod hittades.</p>;

    return (
        <div className="flex flex-col items-center w-64">
            <img 
                src={QrData.qr_img}
                alt="QR code for the can"
                className="w-full h-auto object-contain"
            />
            <p>Burk ID</p>
            <p className="font-bold">{QrData.id}</p>
        </div>
    );
}
