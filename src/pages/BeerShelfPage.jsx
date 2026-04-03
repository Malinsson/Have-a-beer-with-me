// The beercan shelf page, where you can see all the cans you have collected.
import { useSavedDesigns } from "../features/can-designer/hooks/displayCanDesign/useSavedDesigns.js";
import scanCanImage from "../assets/images/barhylla_empty.svg";

import { useState, useEffect } from "react";
import { BackButton } from "../components/BackButton";
import { supabase } from "../lib/supabase.js";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "../components/QRScanner.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";

export const BeerShelfPage = () => {
    const [userId, setUserId] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
            setAuthLoading(false);
        }
        getUser();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Add your search logic here
        console.log("Search query:", searchQuery);
        closeMenu();
    };

    const { savedDesigns, loading, error } = useSavedDesigns(userId);

    if (authLoading) return (
        <div className="flex justify-center items-center h-screen">
            <p>Laddar din hylla...</p>
        </div>
    );

    return (
        <section className="container mx-auto p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <BackButton />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">
                    Min Barhylla
                </h2>
            </div>

            <div className="flex grow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Laddar din hylla...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">Något gick fel.</p>
                ) : savedDesigns.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 flex-1 pb-2"> 
                        <img 
                            src={scanCanImage}
                            alt="can" 
                            className="w-40 h-auto object-contain my-10"
                        />
                        <p className="text-center mt-10">
                            Din barhylla är tom. Scanna andras burkar för att fylla din barhylla.
                        </p>
                        <QRScanner 
                            text="Scanna din första öl" 
                            variant="primary" 
                            onScan={(data) => navigate(`/profile/${data}`)} 
                        />
                        <div className="w-full mt-auto">
                            <form onSubmit={handleSearch} className="flex flex-col mt-15 gap-2">
                                <label><p>Sök efter burk-id</p></label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="andersandersson..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 border border-b-grey"
                                    />
                                    <button type="submit" className="shrink-0">
                                        <IoSearchOutline className="text-2xl" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 p-2">
                        {savedDesigns.map((saved) => (
                            <button
                                key={saved.id}
                                type="button"
                                className="text-left flex flex-col gap-4 p-4"
                                onClick={() => navigate(`/can/${saved.designs.id}`)}
                            >
                                <CanPreview2D side="front" design={saved.designs?.design_data} />
                                <div>
                                    <h3 className="text-xl font-semibold uppercase">
                                        {saved.designs?.design_data?.front?.name?.firstName}
                                    </h3>
                                    <p className="text-sm text-dark-gray">
                                        {saved.designs?.design_data?.back?.department || ""}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}