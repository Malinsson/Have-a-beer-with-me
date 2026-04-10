import { MdOutlineImage } from "react-icons/md";
import { BiFontFamily } from "react-icons/bi";
import { ImageUploader } from "../components/ImageUploader";
import { AlignmentToggle } from "../components/AlignmentToggle";
import { FontPicker } from "../components/FontPicker";

import { TEXTURES, COLORS, FONTS } from "../constants";


export const FrontStep = ({
    mode,
    onModeChange,
    selectedTexture,
    selectedColor,
    selectedFont,
    selectedAlignment,
    onTextureSelect,
    onColorSelect,
    onFontSelect,
    onAlignmentChange,
    onImageUpload,
}) => {

    const activeClass = "border-1 py-1 px-3";
    const inactiveClass = "py-1 px-3";


    return (
        <>
            {/* Mode switcher */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => onModeChange("image")}
                    className={mode === "image" ? activeClass : inactiveClass}
                    aria-pressed={mode === "image"}
                >
                    <MdOutlineImage className="text-3xl" />
                </button>

                <button
                    onClick={() => onModeChange("text")}
                    className={mode === "text" ? activeClass : inactiveClass}
                    aria-pressed={mode === "text"}
                >
                    <BiFontFamily className="text-3xl" />
                </button>
            </div>

            {/* Image mode — textures */}
            {mode === "image" && (
                <>
                <div className="text-center w-full pb-6">
                    <h5 className="text-center mt-4"><strong>ETIKETTDESIGN</strong></h5>

                </div>
                <div className="flex justify-center gap-4">
                    {TEXTURES.map((texture) => (
                        <button
                            key={texture.id}
                            type="button"
                            onClick={() => onTextureSelect(texture.id)}
                            //aria-pressed={selectedTexture === texture.id}
                            className={` overflow-hidden border transition-colors ${
                                selectedTexture === texture.id ? "border-black" : "border-transparent"
                            }`}
                        >
                            <img src={texture.src} alt={texture.label} className="w-10 h-10 object-cover" />
                        </button>
                    ))}
                </div>

                <section className="flex border items-center relative w-full mt-4 mb-12 mx-auto">
                        <ImageUploader onUploadComplete={onImageUpload} />
                </section>

                </>
            )}

            {/* Text mode — colors + font */}
            {mode === "text" && (
                <div className="flex flex-col justify-center gap-4 w-full">
                <h5 className="text-center mt-4"><strong>TYPSNITT DESIGN</strong></h5>

                    <div className="flex justify-center flex-row items-center gap-4 mx-6">

                        <FontPicker selectedFont={selectedFont} onSelect={onFontSelect} />
                        <AlignmentToggle value={selectedAlignment} onChange={onAlignmentChange} />
                    </div>


                    <div className="flex justify-center gap-4 mb-4">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => onColorSelect(color.hex)}
                                aria-label={color.label}
                                aria-pressed={selectedColor === color.hex}
                                className={`w-10 h-10 transition-all border ${
                                    color.hex === "#ffffff" ? "border-neutral-300" : "border-transparent"
                                } ${selectedColor === color.hex ? "shadow-[0_0_0_2px_black]" : ""}`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>

                </div>
            )}
        </>
    );
};