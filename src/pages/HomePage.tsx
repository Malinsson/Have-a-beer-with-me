import { Carousel } from "../assets/carousel/Carousel"
import { slides } from "../assets/carousel/carouselData.json"

export const HomePage = () => {
    return (
        <div className="container mx-auto p-4">
            <div>
                <h2>Ta en öl* med oss</h2>
                <h2>Onsdag 22/4</h2>
                <a className="bg-blue-500"
                    href="">Bygg din öl nu 
                    <i className="fa-solid fa-arrow-right"></i>
                </a>

            </div>

            <Carousel data={slides} />

            <div>
                <p>Vi bjuder på unika virituella öl och dryck - gör det personligt..... Skapa din öl redan nu!</p>
                <a className="bg-blue-500"
                    href="">Bygg din öl nu 
                    <i className="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    );
}