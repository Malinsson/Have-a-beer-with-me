// The beercan shelf page, where you can see all the cans you have collected.
import { useSavedDesigns } from "../features/can-designer/hooks/displayCanDesign/useSavedDesigns.js";
import { useState, useEffect, use } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineQrcode } from "react-icons/hi";
import { supabase } from "../lib/supabase.js";
import { useNavigate } from "react-router-dom";

export const BeerShelfPage = () => {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        }
        getUser();
    }, []);

    const { savedDesigns, loading, error } = useSavedDesigns(userId);

    
    return (
        <section className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <FaArrowLeftLong className="border rounded-full p-2 text-4xl" />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">
                    Min Barhylla
                </h2>
            </div>

            <div className="flex flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Laddar din hylla...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">Något gick fel.</p>
                ) : savedDesigns.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 mt-10"> 
                        <img 
                            src="https://www.shutterstock.com/image-vector/soda-can-icon-vector-design-260nw-2379117639.jpg" 
                            alt="can" 
                        />
                        <p className="text-center px-8">
                            Din Ölhylla är tom. Skanna någons Öl för att lägga till den i hyllan
                        </p>
                        <a href="#">
                            <div className="flex flex-row items-center gap-3 bg-dark-blue rounded-full p-3 w-fit">
                                <p className="text-white text-2xl">Scanna</p>
                                <HiOutlineQrcode className="text-3xl text-white" />
                            </div>
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 p-2">
                        {savedDesigns.map((saved) => (
                            <div 
                                key={saved.id} 
                                className="flex flex-col items-center text-center"
                                onClick={() => navigate(`/can/${saved.designs.id}`)}
                            >
                                <img 
                                    src={saved.designs?.design_data?.front_design_img} 
                                    alt={saved.designs?.name} 
                                    className="w-full h-auto object-cover mb-4" 
                                />
                                <h3 className="text-2xl font-semibold uppercase">
                                    {saved.designs?.name}
                                </h3>
                                <p className="text-lg">
                                    {saved.designs?.design_data?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}