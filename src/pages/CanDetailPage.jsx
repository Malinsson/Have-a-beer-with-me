// This is the view when you tap on a can on the shelf on your profile.
import { Button } from "../components/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useDesign } from "../features/can-designer/hooks/displayCanDesign/useDesigns.js";
import { useProfileByUserId } from "../features/profile/hooks/useProfileByUserId.js";
import { useSaveCanToShelf } from "../features/can-designer/hooks/displayCanDesign/useSaveCanToShelf.js";
import { CanPreview2D } from "../features/can-designer/components/CanPrewiew2D.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export const CanDetailPage = () => {
    const { shareId } = useParams();

    const { design, loading: designLoading, error: designError } = useDesign(shareId);
    const { profile, loading: profileLoading, error: profileError } = useProfileByUserId(design?.user_id);
    const { saveCanToShelf, savingDesignId } = useSaveCanToShelf();
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };

        fetchUser();
    }, []);
  
    if (designLoading || profileLoading) return <p>Laddar...</p>;
    if (designError || profileError) return <p>Något gick fel.</p>;
    if (!design || !profile) return <p>Ingen ölburk hittades.</p>;

    const { design_data } = design;
    const canSave = currentUserId && currentUserId !== design.user_id;
    
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-center text-2xl">
                {profile.first_name} {profile.last_name}
            </h2>
            <div className="container mx-auto p-4 flex justify-center">
                <CanPreview2D side="front" design={design_data} />
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
                <FaArrowLeftLong />
                <p>Front</p>
                <FaArrowRightLong />
            </div>
            <div className="flex justify-center mb-10">
                {canSave && (
                    <Button 
                        text={savingDesignId === design.id ? "Sparar..." : "Lägg till i ölhyllan"} 
                        onClick={async () =>
                            saveCanToShelf({
                                designId: design.id,
                                shareId: design.share_id,
                            })
                        }
                        variant="primary"
                        showIcon={false}
                        disabled={savingDesignId === design.id}
                    />
                )}
            </div>
            <div>
                <h4 className="text-lg pb-4">Innehållsförteckning</h4>
                <h5 className="text-xl font-semibold">{profile.first_name} {profile.last_name}</h5>
                <p className="text-xl font-semibold text-dark-gray">{design_data?.back?.department}</p>
                <p className="py-2">{design_data?.back?.description}</p>
                <div className="flex flex-row gap-2 pb-2">
                    {(design_data?.back?.tags || []).map((tag) => (
                        <p key={tag}>#{tag?.label}</p>
                    ))}
            
                </div>    
                <div className="flex flex-col text-lg">
                    {profile.instagram_url && <a href={profile.instagram_url}>Instagram</a>}
                    {profile.linkedin_url && <a href={profile.linkedin_url}>LinkedIn</a>}
                    {profile.github_url && <a href={profile.github_url}>GitHub</a>}
                </div>
            </div>
        </div>
    );
}