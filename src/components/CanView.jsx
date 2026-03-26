import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";


export const CanView = ({ frontImg, backImg }) => {
    const [canData, setCanData] = useState(null);
    const [isFront, setIsFront] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanImages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('beer_designs') // Name of your table
                .select('front_url, back_url') // Your column names
                .eq('id', canId)
                .single();
            if (error) {
                console.error("Error fetching can images:", error);
            } else {
                setCanData(data);
            }
            setLoading(false);
        };

        if (canId) fetchCanImages();
    }, [canId]);

    if (loading) return <p>Hämtar design...</p>;
    if (!canData) return <p>Ingen design hittades.</p>;

    return (
        <div className="flex flex-col items-center gap-4">
            <img 
                src={isFront ? canData.front_url : canData.back_url}
                alt={isFront ? "Front of the can" : "Back of the can"}
                className="w-full h-auto object-contain"
            />
            <div className="flex items-center gap-4">
                <button>
                    <FaArrowLeftLong onClick={() => setIsFront(!isFront)} className="text-2xl" />
                </button>

                <p>{isFront ? "Framsida" : "Baksida"}</p>
                
                <button>
                    <FaArrowRightLong onClick={() => setIsFront(!isFront)} className="text-2xl" />
                </button>
            </div>
        </div>
    );
}