// The beercan shelf page, where you can see all the cans you have collected.
import { useState, useEffect } from "react";
import scanCanImage from "../assets/images/yrgo-can.png";
import { useDesignStore } from "../store/designStore.js";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchForm } from "../shared/hooks/useSearchForm.js";

import { BackButton } from "../shared/components/BackButton.jsx";
import { QRScanner } from "../shared/components/QRScanner.jsx";
import { ShelfItem } from "../features/profile/components/beershelfLayout/ShelfItem.jsx";
import { SearchForm } from "../shared/components/SearchForm.jsx";

export const BeerShelfPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { profile, loading: profileLoading, error: profileError } = useProfileInfo(slug);
    const getSavedDesigns = useDesignStore((state) => state.getSavedDesignsByUserId);

    const [savedCans, setSavedCans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const { searchQuery, setSearchQuery, handleSearch, searchError, isSearching } = useSearchForm();

    useEffect(() => {
        if (profileLoading) return;
        if (!profile?.id) {
            setLoading(false);
            return;
        }

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
    }, [profile?.id, profileLoading]);

    useEffect(() => {
        if (profile?.id == null && !loading && !profileLoading) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
    
            const redirect = setTimeout(() => {
                navigate("/login");
            }, 3000);
    
            return () => {
                clearInterval(timer);
                clearTimeout(redirect);
            };
        }
    }, [profile, loading, profileLoading]);

    if (profile?.id == null && !loading && !profileLoading) return (
        <div className="flex flex-col mt-12 gap-4 w-full text-center p-6">
            <h3>Du behöver ett konto för att se din barhylla.</h3>
            <div className="flex justify-center">
                <img 
                    src={scanCanImage}
                    alt="empty shelf" 
                    className="w-40 h-auto object-contain my-10"
                />
            </div>
            <p>Du skickas till inloggningen om <span className="bold text-xl text-yrgo-red">{countdown}</span> sekunder...</p>
        </div>
    );

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

            {/* State when there are no saved cans */}
            {savedCans.length === 0 ? (
                <div className="flex flex-col items-center gap-6 flex-1 pb-2"> 
                    <img 
                        src={scanCanImage}
                        alt="empty shelf" 
                        className="w-60 h-auto object-contain mt-10"
                    />
                    <p className="text-center">
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

                    <div className="fixed bottom-0 right-0 left-0 p-4 w-full mt-15 bg-white">
                        <SearchForm 
                            searchQuery={searchQuery} 
                            setSearchQuery={setSearchQuery}
                            handleSearch={handleSearch}
                            labelText="Sök efter en burk" 
                        />
                        {searchError && (
                            <p className="mt-2 text-sm text-red-500">{searchError}</p>
                        )}
                        {isSearching && (
                            <p className="mt-2 text-sm text-gray-500">Söker...</p>
                        )}
                    </div>

                </div>
            ) : ( 
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-6"> 
                        {savedCans.map((can) => (
                            <ShelfItem 
                                key={can.savedId || can.id || can.share_id} 
                                can={can}
                            />
                        ))}
                    </div>

                    <div className="w-full mt-12">
                        <SearchForm 
                            searchQuery={searchQuery} 
                            setSearchQuery={setSearchQuery}
                            handleSearch={handleSearch}
                            labelText="Sök efter en annan burk" 
                        />
                        {searchError && (
                            <p className="mt-2 text-sm text-red-500">{searchError}</p>
                        )}
                        {isSearching && (
                            <p className="mt-2 text-sm text-gray-500">Söker...</p>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}