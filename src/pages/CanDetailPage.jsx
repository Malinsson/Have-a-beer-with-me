// This is the view when you tap on a can on the shelf on your profile.
import can from "../assets/images/can.jpg";
import { Button } from "../components/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import { useState, useEffect, use } from "react";
import { supabase } from "../lib/supabase";

export const CanDetailPage = () => {
    const [canDesign, setCanDesign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanDesign = async () => {
            const { data, error } = await supabase
                .from("can_designs")
                .select("*")
                .eq("id", canId)
                .single();

            if (error) {
                console.error("Error fetching can design:", error);
            } else {
                setCanDesign(data);
            }
            setLoading(false);
        };

        fetchCanDesign();
    }, []);

    if (loading) return <p>Laddar...</p>;
    if (!canDesign) return <p>Ingen ölburk hittades.</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-center text-2xl">{profile.first_name} {profile.last_name}</h2>
            <div className="container mx-auto p-4 flex justify-center">
                <img src={can} alt="" />
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
                <FaArrowLeftLong />
                <p>Front</p>
                <FaArrowRightLong />
            </div>
            <div className="flex justify-center mb-10">
                <Button text="Lägg till i ölhyllan" onClick={() => setStep("info")} variant="primary" />
            </div>
            <div>
                <h4 className="text-lg pb-4">Innehållsförteckning</h4>
                <h5 className="text-xl font-semibold">{profile.first_name} {profile.last_name}</h5>
                <p className="text-xl font-semibold text-dark-gray">{profile.role}</p>
                <p className="py-2">{profile.bio}</p>
                <div className="flex flex-row gap-2 pb-2">
                    {profile.tags.map((tag) => (
                        <p key={tag}>#{tag}</p>
                    ))}
            
                </div>    
                <div className="flex flex-col text-lg">
                    {profile.facebook && <a href={profile.facebook}>Facebook</a>}
                    {profile.instagram && <a href={profile.instagram}>Instagram</a>}
                    {profile.linkedin && <a href={profile.linkedin}>LinkedIn</a>}
                    {profile.github && <a href={profile.github}>GitHub</a>}
                </div>
            </div>
        </div>
    );
}