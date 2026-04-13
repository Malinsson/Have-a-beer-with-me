import { useNavigate } from "react-router-dom";
import { Button } from "../shared/components/Button.jsx";
import { Footer } from "../shared/components/Footer.jsx";
import { useUserSlug } from "../features/profile/hooks/useUserSlug";
import homeImgage from "../assets/images/home.png"
import yrgoCanImage from "../assets/images/yrgo-can.png";

export const HomePage = () => {
    const navigate = useNavigate();
    const slug = useUserSlug();

    return (
        <>
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <section 
                className="relative h-[65vh] w-full bg-cover bg-center flex flex-col justify-between p-6 overflow-hidden" 
                style={{ backgroundImage: homeImgage ? `url(${homeImgage})` : "none" }}
            >
                
                <div>
                    <h1>Ta en öl* <br /> Med Yrgo</h1>
                    <h4>14:00 – 16:30 <br /> <em>Onsdag</em> <br /> 22 April</h4>
                </div>

                <div className="flex flex-col gap-6">
                    
                    <div className="flex gap-4">
                        {slug && (
                            <div className="flex-1">
                                <Button text="Profil" onClick={() => navigate(`/profile/${slug}`)} />
                            </div>
                        )}
                        <div className={slug ? "flex-2" : "w-3/5 ml-auto"}>
                            <Button text="Designa din burk" onClick={() => navigate("/intro")} />
                        </div>
                    </div>

                </div>
            </section>

            <section className="py-12 px-8 flex flex-col">
                <div className="w-full max-w-sm mb-8 items-center text-center">
                    <img src={yrgoCanImage} alt="beercan" />
                </div>
                <div className="flex flex-col items-end">
                    <p className="large pb-6">
                    SKAPA DIN EGEN DIGITALA BURK för YRGO:s LIA-event på Visual Arena, 
                    Lindholmen. Här möts framtida digitala designers, webbutvecklare och 
                    folk från branschen.
                    </p>
                    <div className="w-50">
                        <Button text="Designa din burk" onClick={() => navigate("/intro")} />
                    </div>
                </div>
            </section>
        </div>
        <Footer />
    </>

    );
}