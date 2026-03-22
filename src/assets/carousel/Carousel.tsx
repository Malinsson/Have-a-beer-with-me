import React from "react";

interface SlideItem {
    src: string;
    alt: string;
  }
  
  interface CarouselProps {
    data: SlideItem[];
  }

export const Carousel: React.FC<CarouselProps> = ({ data }) => {
    // const [currentIndex, setCurrentIndex] = useState<number>(0);

    return (
        <div className="carousel">
            {data.map((item, index) => {
                return <img src={item.src} alt={item.alt} key={index} 
                    className="slide" />
            })}
        </div>
    );
}
