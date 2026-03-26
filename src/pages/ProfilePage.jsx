import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.js"
import { HiOutlineQrcode } from "react-icons/hi";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import QRCodeSvg from "../assets/images/QR_code.svg";
import { CanView } from "../components/CanView.jsx";
import { FetchQrCode } from "../components/FetchQrCode.jsx";

export const ProfilePage = () => {
    return (
        <div id="top" className="container mx-auto p-4">
            <h2 className="text-center text-3xl font-normal">Mitt namn</h2>
    
            <section className="py-12 px-8 flex flex-col items-center text-center gap-6">
                <CanView />
                    <FetchQrCode />
                    <div className="fixed bottom-6 right-6 bg-blue-950 rounded-full p-3 z-40">
                        <a href="">
                            <HiOutlineQrcode className="text-5xl text-white" />
                        </a>
                    </div>
            </section>
        </div>
    );
}