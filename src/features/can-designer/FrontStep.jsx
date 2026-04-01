import { CiImageOn } from "react-icons/ci";
import { IoTextOutline } from "react-icons/io5";
import { PiAlignCenterVertical } from "react-icons/pi";
import { ImageUploader } from "./components/ImageUploader";

import { TEXTURES, COLORS, FONTS } from "./constants";


export const FrontStep = ({
    mode,
    onModeChange,
    selectedTexture,
    selectedColor,
    onTextureSelect,
    onColorSelect,
}) => {

    const activeClass = "border-2 py-1 px-3";
    const inactiveClass = "py-1 px-3";

    return (
        <>
            {/* Mode switcher */}
            <div className="flex justify-center my-8 gap-8">
                <button
                    onClick={() => onModeChange("image")}
                    className={mode === "image" ? activeClass : inactiveClass}
                    aria-pressed={mode === "image"}
                >
                    <CiImageOn className="text-3xl" />
                </button>

                <button
                    onClick={() => onModeChange("text")}
                    className={mode === "text" ? activeClass : inactiveClass}
                    aria-pressed={mode === "text"}
                >
                    <IoTextOutline className="text-3xl" />
                </button>
            </div>

            {/* Image mode — textures */}
            {mode === "image" && (
                <>
                <div className="flex justify-center gap-4">
                    {TEXTURES.map((texture) => (
                        <button
                            key={texture.id}
                            type="button"
                            onClick={() => onTextureSelect(texture.id)}
                            //aria-pressed={selectedTexture === texture.id}
                            className={` overflow-hidden border-2 transition-colors ${
                                selectedTexture === texture.id ? "border-black" : "border-transparent"
                            }`}
                        >
                            <img src={texture.src} alt={texture.label} className="w-10 h-10 object-cover" />
                        </button>
                    ))}
                </div>

                <section className="flex border items-center relative w-full mt-4 mb-12 mx-auto">
                        <ImageUploader />
                </section>

                </>
            )}

            {/* Text mode — colors + font */}
            {mode === "text" && (
                <div className="flex flex-col justify-center gap-4">

                    <div className="flex justify-center flex-row items-center gap-4">
                        <select className="border border-black px-4 py-2"
                        aria-label="Välj typsnitt">
                            {FONTS.map((font) => (
                                <option key={font.id} value={font.id}>
                                    {font.label}
                                </option>
                            ))}
                        </select>
                        <div className="bg-dark-blue rounded-full p-2">
                            <PiAlignCenterVertical className="text-4xl text-white" />
                        </div>
                    </div>


                    <div className="flex justify-center gap-4">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => onColorSelect(color.hex)}
                                aria-label={color.label}
                                aria-pressed={selectedColor === color.hex}
                                className={`w-10 h-10 transition-all border ${
                                    color.hex === "#ffffff" ? "border-neutral-300" : "border-transparent"
                                } ${selectedColor === color.hex ? "shadow-[0_0_0_3px_black]" : ""}`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>

                </div>
            )}
        </>
    );
};