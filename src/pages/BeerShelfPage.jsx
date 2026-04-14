import { useState, useEffect } from "react";
import scanCanImage from "../assets/images/yrgo-can.png";
import { useDesignStore } from "../store/designStore.js";
import { supabase } from "../lib/supabase.js";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchForm } from "../shared/hooks/useSearchForm.js";
import { invokeProfileBootstrap } from "../features/profile/hooks/profileBootstrap.js";

import { BackButton } from "../shared/components/BackButton.jsx";
import { QRScanner } from "../shared/components/QRScanner.jsx";
import { ShelfItem } from "../features/profile/components/beershelfLayout/ShelfItem.jsx";
import { SearchForm } from "../shared/components/SearchForm.jsx";
import { LoginRedirectMessage } from "../shared/components/LoginRedirectMessage.jsx";

export const BeerShelfPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const getSavedDesigns = useDesignStore((state) => state.getSavedDesignsByUserId);

    const [profile, setProfile] = useState(null);
    const [savedCans, setSavedCans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery, setSearchQuery, handleSearch, searchError, isSearching } = useSearchForm();

    useEffect(() => {
        if (!slug) {
            setProfile(null);
            setSavedCans([]);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;

        const fetchShelfData = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data: bootstrapData, error: bootstrapError } = await invokeProfileBootstrap({
                    slug,
                    includeShelf: true,
                });

                if (!cancelled && !bootstrapError && bootstrapData?.profile) {
                    setProfile(bootstrapData.profile || null);
                    setSavedCans(bootstrapData.savedCans || bootstrapData.shelf || []);
                    setLoading(false);
                    return;
                }

                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("slug_value", slug)
                    .maybeSingle();

                if (profileError) throw profileError;

                if (!profileData?.id) {
                    if (cancelled) return;
                    setProfile(null);
                    setSavedCans([]);
                    setLoading(false);
                    return;
                }

                const result = await getSavedDesigns(profileData.id);

                if (cancelled) return;
                setProfile(profileData);

                if (result.success) {
                    setSavedCans(result.designs);
                } else {
                    setError(new Error(result.error));
                    setSavedCans([]);
                }
            } catch (caughtError) {
                if (cancelled) return;
                setError(caughtError);
                setProfile(null);
                setSavedCans([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchShelfData();

        return () => {
            cancelled = true;
        };
    }, [getSavedDesigns, slug]);

    if (profile?.id == null && !loading) return (
        <LoginRedirectMessage message="Du behöver ett konto för att se din barhylla." />
    );

    if (loading) return (
        <div className="flex justify-center items-center mt-12">
            <p>Hämtar din barhylla...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center mt-12">
            <p>Något gick fel: {error?.message || "Okänt fel"}</p>
        </div>
    );

    return (
        <section className="container mx-auto p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <BackButton to={`/profile/${slug}`} />
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
                        Din barhylla är tom. Skanna andras burkar för att fylla din barhylla.
                    </p>

                    <QRScanner 
                        text="Skanna din första burk" 
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