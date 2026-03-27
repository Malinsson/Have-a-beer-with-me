import React, { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

export const Carousel = ({ data }) => {
    const [slide, setSlide] = useState(0);

    const nextSlide = () => {
        setSlide(slide === data.length -1 ? 0 : slide + 1);
    }

    const prevSlide = () => {
        setSlide(slide === 0 ? data.length - 1 : slide - 1);
    }

    return (
        <div className="relative flex justify-center items-center w-full h-auto">
            <BsArrowLeftCircleFill 
                className="absolute left-4 w-8 h-8 text-white drop-shadow-md" 
                onClick={prevSlide} />

            {data.map((item, index) => {
                return <img src={item.src} alt={item.alt} key={index} 
                    className={slide === index ? "w-full h-auto" : "w-full h-auto hidden"} />
            })}
            <BsArrowRightCircleFill 
                className="absolute right-4 w-8 h-8 text-white drop-shadow-md" 
                onClick={nextSlide} />

            <span className="absolute bottom-4 flex gap-1">
                {data.map((_, index) => {
                    return ( <button key={index} onClick={() => setSlide(index)} className={slide === index ? "w-2 h-2 bg-yrgo-red rounded-full border-none outline-none drop-shadow-md" : "w-2 h-2 bg-gray-500 rounded-full border-none outline-none drop-shadow-md"}></button>
                    );
                })}
            </span>
        </div>
    );
};
