import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.json"
import { TiCameraOutline } from "react-icons/ti";
import { FiArrowUpCircle } from "react-icons/fi";


export const ProfilePage = () => {
    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">Mitt namn</h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <div className="w-full max-w-sm mb-8">
                    <Carousel data={slides} />
                </div>
                <div className="flex flex-row items-center gap-4">
                    <a 
                        className="text-black px-6 py-3 rounded-full flex items-center font-bold text-xs uppercase border border-black tracking-widest shadow-lg"
                        href="#"
                    >
                        Se min ölhylla
                    </a>
                    <a className="bg-blue-950 text-white px-2 py-2 rounded-full flex items-center font-bold text-2xl uppercase tracking-widest shadow-lg"
                        href="">
                        <TiCameraOutline />
                    </a>
                </div>
                    <a className="underline"
                        href="">Problem att scanna? Scrolla ned
                    </a>
                    <div id="QrCode" className="w-64 h-64 flex flex-col items-center justify-center">
                        <img className="w-32 h-32 object-contain" 
                            src="/src/assets/images/QR_code.svg" 
                            alt="qr-code" />
                        <p>QrCode number</p>
                    </div>
                    <a href="#top">
                        <FiArrowUpCircle className="text-6xl"/>
                    </a>
            </section>
        </div>
    );
}