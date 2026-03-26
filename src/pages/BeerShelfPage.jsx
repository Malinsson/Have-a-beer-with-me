// The beercan shelf page, where you can see all the cans you have collected.
import { useState, useEffect, use } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineQrcode } from "react-icons/hi";
import { supabase } from "../lib/supabase";

export const BeerShelfPage = () => {
    const [savedCans, setSavedCans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedCans = async () => {
            const { data, error } = await supabase
                .from("saved_cans")
                .select("*")
                .eq("user_id", supabase.auth.user().id);

            if (error) {
                console.error("Error fetching saved cans:", error);
            } else {
                setSavedCans(data);
            }
            setIsLoading(false);
        };

        fetchSavedCans();
    }, []);

    return (
        <section className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <FaArrowLeftLong className="border rounded-full p-2 text-4xl" />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">Min Barhylla</h2>
            </div>

            <div className="flex flex-grow">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Laddar din hylla...</p>
                    </div>
                ) : savedCans.length === 0 ? (
                <>
                    <div className="flex flex-col items-center gap-4 mt-10"> 
                        <img src="https://www.shutterstock.com/image-vector/soda-can-icon-vector-design-260nw-2379117639.jpg" alt="can" />
                        <p className="text-center px-8">Din Ölhylla är tom. Skanna någons Öl för att lägga till den i hyllan</p>
                    </div>
                    <div className="flex justify-center mt-8 mb-4">
                        <a href="#">
                            <div className="flex flex-row items-center gap-3 bg-dark-blue rounded-full p-3 w-fit">
                                <p className="text-white text-2xl">Scanna</p>
                                <HiOutlineQrcode className="text-3xl text-white" />
                            </div>
                        </a>
                    </div>
                </>
                ) : (
                    <div className="grid grid-cols-2 gap-6 p-2">
                        {savedCans.map((can) => (
                            <div key={can.id} className="flex flex-col items-center text-center">
                                <img src={can.front_design_img} alt={`${can.first_name}'s beer`} className="w-full h-auto object-cover mb-4" />
                                <h3 className="text-2xl font-semibold uppercase">{can.first_name}</h3>
                                <p className="text-lg">
                                    {can.role}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}