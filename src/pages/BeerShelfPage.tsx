// The beercan shelf page, where you can see all the cans you have collected.
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineQrcode } from "react-icons/hi";

export const BeerShelfPage = () => {
    return (
        <section className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <FaArrowLeftLong className="border rounded-full p-2 text-4xl" />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl">Min Barhylla</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
                <img src="https://www.shutterstock.com/image-vector/soda-can-icon-vector-design-260nw-2379117639.jpg" alt="can" />
                <p className="text-center px-8">Din Ölhylla är tom. Skanna någons Öl för att lägga till den i hyllan</p>
            </div>
            <div className="flex justify-center my-8">
                <a href="">
                    <div className="flex flex-row items-center gap-3 bg-dark-blue rounded-full p-3 w-fit">
                        <p className="text-white text-2xl">Scanna</p>
                        <HiOutlineQrcode className="text-3xl text-white" />
                    </div>
                </a>
            </div>
        </section>
    );
}