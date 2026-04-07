import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.js"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import homeImgage from "../assets/images/home.png"


export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <section 
                className="relative h-[65vh] w-full bg-cover bg-center flex flex-col justify-between p-6 overflow-hidden" 
                style={{ backgroundImage: homeImgage ? `url(${homeImgage})` : "none" }}
            >
                
                <div>
                    <h1>Ta en öl* <br /> Med Yrgo</h1>
                    <h4>14:00 – 16:30 <br /> Onsdag <br /> 22 April</h4>
                </div>

                <div className="flex flex-col items-end gap-6">
                    
                    <div className="w-50">
                        <Button text="Bygg din öl nu" onClick={() => navigate("/intro")} />
                    </div>

                </div>
            </section>

            <section className="py-12 px-8 flex flex-col">
                <div className="w-full max-w-sm mb-8 items-center text-center">
                    <Carousel data={slides} />
                </div>
                <div className="flex flex-col items-end">
                    <p className="large pb-6">
                        *SKAPA DIN EGNA DIGITALA burk för YRGOS LIA-event på Visual Arena, 
                        Lindholmen. Här möter Digitala Designers och Webbutvecklare branschen
                    </p>
                    <div className="w-50">
                        <Button text="Bygg din öl nu" onClick={() => navigate("/intro")} />
                    </div>
                </div>
            </section>
        </div>
        <Footer />
    </>

    );
}