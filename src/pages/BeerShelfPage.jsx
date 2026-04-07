// The beercan shelf page, where you can see all the cans you have collected.
import { useState, useEffect } from "react";
import scanCanImage from "../assets/images/barhylla_empty.svg";

import { useDesignStore } from "../store/designStore.js";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useParams, useNavigate } from "react-router-dom";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";

import { BackButton } from "../components/BackButton";
import { QRScanner } from "../components/QRScanner.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { ShelfItem } from "../features/profile/ShelfItem.jsx";

export const BeerShelfPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { profile, loading: profileLoading, error: profileError } = useProfileInfo(slug);
    const getSavedDesigns = useDesignStore((state) => state.getSavedDesignsByUserId);

    const [savedCans, setSavedCans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!profile?.id) return;

        const fetchCans = async () => {
            const result = await getSavedDesigns(profile.id);

            if (result.success) {
                setSavedCans(result.designs);
            } else {
                setFetchError(result.error);
            }
            setLoading(false);
        }
        fetchCans();
    }, [profile?.id]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/profile/${searchQuery.trim()}`);
        setSearchQuery("")
    };

    if (loading || profileLoading) return (
        <div className="flex justify-center items-center mt-12">
            <p>Hämtar din barhylla...</p>
        </div>
    );

    if (profileError || fetchError) return (
        <div className="flex justify-center items-center mt-12">
            <p>Något gick fel: {profileError?.message || fetchError}</p>;
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

            
            {savedCans.length === 0 ? (
                <div className="flex flex-col items-center gap-6 flex-1 pb-2"> 
                    <img 
                        src={scanCanImage}
                        alt="empty shelf" 
                        className="w-40 h-auto object-contain my-10"
                    />
                    <p className="text-center mt-10">
                        Din barhylla är tom. Scanna andras burkar för att fylla din barhylla.
                    </p>
                    <QRScanner 
                        text="Scanna din första öl" 
                        variant="primary" 
                        onScan={(data) => {
                            const url = new URL(data);
                            navigate(url.pathname);
                        }}
                    />
                    <div className="w-full mt-12">
                        <form onSubmit={handleSearch} className="flex flex-col gap-2 w-full">
                            <label className="text-base font-semibold uppercase">Sök efter burk-id</label>
                            <div className="flex items-center gap-3">
                                <input
                                type="text"
                                placeholder="andersandersson..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-b-grey"
                                />
                                <button type="submit" className="flex-shrink-0">
                                <IoSearchOutline className="text-2xl" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-6 gap-x-4 gap-y-8">
                        {savedCans.map((can) => (
                            <div 
                                key={can.savedId} 
                                className="flex flex-col"
                                onClick={() => navigate(`/profile/${can.ownerSlug}`)}
                            >
                                <div className="w-full flex items-center justify-center px-12 mt-4">
                                    <CanPreview2D side="front" design={can} scale={0.6} />
                                </div>

                                <div className="pl-2 mt-3">
                                    <p className="bold text-xl">
                                        {can.ownerFirstName} <br /> {can.ownerLastName}
                                    </p>
                                    <h4 className="text-lg text-black">
                                        {can.department}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full pb-4 mt-12">
                        <form onSubmit={handleSearch} className="flex flex-col gap-2 w-full">
                            <label className="text-sm font-bold uppercase tracking-wider">Sök efter annan burk</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Skriv ett ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                                />
                                <button type="submit" className="bg-black text-white p-3">
                                    <IoSearchOutline className="text-2xl" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}