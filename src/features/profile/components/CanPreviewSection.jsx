import { useState } from "react";
import { CanPreview2D } from "../../can-designer/components/CanPrewiew2D.jsx";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";


export const CanPreviewSection = ({ design }) => {

        const [previewSide, setPreviewSide] = useState("front");

        function handleSideToggle() {
            setPreviewSide((prev) => (prev === "front" ? "back" : "front"));
        }
    
            return (
            <section className="flex flex-col">
    
 
                        <div className="max-w-xl mx-auto w-full">
    
                            <article className="p-4 bg-white/80 flex flex-col gap-4" >
                                
                                <CanPreview2D side={previewSide} design={design?.design_data} />
                                
                            </article>
                        </div>
                    

                    <div className="flex items-center gap-16 mx-auto my-4">
                        <a onClick={handleSideToggle} >
                            <MdOutlineArrowBackIosNew />
                        </a>
                        <a onClick={handleSideToggle}>
                            <MdOutlineArrowForwardIos />
                        </a>
                    </div>
                </section>
            )
}