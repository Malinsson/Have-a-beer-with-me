import { useState } from "react";
import { CanPreview2D } from "../../../can-designer/components/CanPrewiew2D.jsx";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";

export const CanPreviewSection = ({ design }) => {
    const [previewSide, setPreviewSide] = useState("front");

    const handleSideToggle = () => {
        setPreviewSide((prev) => (prev === "front" ? "back" : "front"));
    };

    if (!design) {
        return <p className="text-center">Ingen burk hittades.</p>;
    }

    return (
        <section className="flex flex-col">
            <div className="max-w-xl mx-auto w-full">
                <article className="p-4 bg-white/80 flex flex-col gap-4">
                    <div className={previewSide === "front" ? "block" : "hidden"}>
                        <CanPreview2D side="front" design={design?.design_data} />
                    </div>
                    <div className={previewSide === "back" ? "block" : "hidden"}>
                        <CanPreview2D side="back" design={design?.design_data} />
                    </div>
                </article>
            </div>

            <div className="flex items-center justify-center gap-16 pb-2">
                <button
                    type="button"
                    onClick={handleSideToggle}
                    className="p-2 hover:opacity-70"
                    aria-label="Previous side"
                >
                    <MdOutlineArrowBackIosNew className="text-xl" />
                </button>
                <button
                    type="button"
                    onClick={handleSideToggle}
                    className="p-2 hover:opacity-70"
                    aria-label="Next side"
                >
                    <MdOutlineArrowForwardIos className="text-xl" />
                </button>
            </div>
        </section>
    );
};