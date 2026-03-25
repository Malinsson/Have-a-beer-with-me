import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.js"
import { HiOutlineQrcode } from "react-icons/hi";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import QRCodeSvg from "../assets/images/QR_code.svg";

export const ProfilePage = () => {
    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">Mitt namn</h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <div className="w-full max-w-sm mb-8">
                    <Carousel data={slides} />
                </div>
                <div className="flex flex-row items-center gap-4">
                    <FaArrowLeftLong />
                    <p>Front</p>
                    <FaArrowRightLong />

                    {/* <a 
                        className="text-black px-6 py-3 rounded-full flex items-center font-bold text-xs uppercase border border-black tracking-widest shadow-lg"
                        href="#">Se min ölhylla
                    </a>
                    <a className="bg-blue-950 text-white px-2 py-2 rounded-full flex items-center font-bold text-2xl uppercase tracking-widest shadow-lg"
                        href="">
                        <TiCameraOutline />
                    </a> */}
                </div>
                    <div id="QrCode" className="w-64 flex flex-col items-center">
                        <img className="w-26 h-26 object-contain" 
                            src={QRCodeSvg}
                            alt="qr-code" />
                        <p>Burk ID</p>
                        <p className="font-bold">4444</p>
                    </div>
                    <div className="fixed bottom-6 right-6 bg-blue-950 rounded-full p-3 z-40">
                        <a href="">
                            <HiOutlineQrcode className="text-5xl text-white" />
                        </a>
                    </div>
            </section>
        </div>
    );
}