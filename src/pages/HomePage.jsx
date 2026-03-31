import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.js"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";


export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <section 
                className="relative h-[80vh] w-full bg-cover bg-center flex flex-col justify-between p-6 overflow-hidden" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595642527404-0a937af8634c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
            >
                {/* Top Text (Ta en öl...) */}
                <div className="pt-10">
                    <h1 className="text-5xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                        Ta en öl* <br /> Med oss
                    </h1>
                </div>

                {/* Bottom Text & Button (Onsdag...) */}
                <div className="flex flex-col items-end gap-6">
                    <h2 className="text-5xl font-black text-black uppercase text-right leading-[0.9]">
                        Onsdag <br /> 22/4
                    </h2>

                    {/* Using mt-6 instead of mt-50 for standard spacing */}
                    <Button text="Bygg din öl nu" onClick={() => navigate("/intro")} variant="primary" />
                </div>
            </section>

            <section className="py-12 px-8 flex flex-col">
                <div className="w-full max-w-sm mb-8 items-center text-center">
                    <Carousel data={slides} />
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-lg items-start mb-6">
                        *Onsdag 22 April kl 15:00-16:30 är det LIA event på Visual Arena 
                        på Lindholmen. Digitala Designers och Webbutvecklare möter branschen 
                        med en mingelaktivitet!
                    </p>
                    <Button text="Bygg din öl nu" onClick={() => navigate("/intro")} variant="primary" />
                </div>
            </section>
        </div>
    );
}