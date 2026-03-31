// This is the view when you tap on a can on the shelf on your profile.
import { Button } from "../components/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useDesign } from "../features/can-designer/hooks/displayCanDesign/useDesigns.js";
import { useProfileInfo } from "../features/profile/hooks/useProfileInfo.js";

export const CanDetailPage = () => {
    const { designId } = useParams();
    // const { userId, canId } = useParams();

    const { design, loading: designLoading, error: designError } = useDesign(designId);
    const { profile, loading: profileLoading, error: profileError } = useProfileInfo(design?.user_id);
  
    if (designLoading || profileLoading) return <p>Laddar...</p>;
    if (designError || profileError) return <p>Något gick fel.</p>;
    if (!design || !profile) return <p>Ingen ölburk hittades.</p>;

    const { design_data } = design;
    
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-center text-2xl">
                {profile.first_name} {profile.last_name}
            </h2>
            <div className="container mx-auto p-4 flex justify-center">
                <img src={design_data?.imageUrl} alt="Can design" />
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
                <FaArrowLeftLong />
                <p>Front</p>
                <FaArrowRightLong />
            </div>
            <div className="flex justify-center mb-10">
                <Button 
                    text="Lägg till i ölhyllan" 
                    onClick={() => setStep("info")} 
                    variant="primary" 
                />
            </div>
            <div>
                <h4 className="text-lg pb-4">Innehållsförteckning</h4>
                <h5 className="text-xl font-semibold">{profile.first_name} {profile.last_name}</h5>
                <p className="text-xl font-semibold text-dark-gray">{design_data?.department}</p>
                <p className="py-2">{design_data?.description}</p>
                <div className="flex flex-row gap-2 pb-2">
                    {design_data.tags.map((tag) => (
                        <p key={tag}>#{tag}</p>
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