import { CiImageOn } from "react-icons/ci";
import { IoTextOutline } from "react-icons/io5";
import { PiAlignCenterVertical } from "react-icons/pi";
// import type { DesignerMode } from "./types";
import { TEXTURES, COLORS } from "./constants";


export const FrontStep = ({
    mode,
    selectedTexture,
    selectedColor,
    onModeChange,
    onTextureSelect,
    onColorSelect
}) => {

    const activeClass = "bg-neutral-300 rounded-lg py-1 px-3";
    const inactiveClass = "py-1 px-3";

    return (
        <>
            {/* Mode switcher */}
            <div className="flex justify-center my-8 gap-8">
                <button
                    type="button"
                    onClick={() => onModeChange("image")}
                    className={mode === "image" ? activeClass : inactiveClass}
                    aria-pressed={mode === "image"}
                >
                    <CiImageOn className="text-3xl" />
                </button>

                <button
                    type="button"
                    onClick={() => onModeChange("text")}
                    className={mode === "text" ? activeClass : inactiveClass}
                    aria-pressed={mode === "text"}
                >
                    <IoTextOutline className="text-3xl" />
                </button>
            </div>

            {/* Image mode — textures */}
            {mode === "image" && (
                <div className="flex justify-center gap-4">
                    {TEXTURES.map((texture) => (
                        <button
                            key={texture.id}
                            type="button"
                            onClick={() => onTextureSelect(texture.id)}
                            aria-pressed={selectedTexture === texture.id}
                            className={`rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedTexture === texture.id ? "border-black" : "border-transparent"
                            }`}
                        >
                            <img src={texture.src} alt={texture.label} className="w-16 h-16 object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Text mode — colors + font */}
            {mode === "text" && (
                <div className="flex flex-col justify-center gap-4">
                    <div className="flex justify-center gap-4">
                        {COLORS.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => onColorSelect(color.id)}
                                aria-label={color.label}
                                aria-pressed={selectedColor === color.id}
                                className={`w-10 h-10 rounded-full transition-all border ${
                                    color.hex === "#ffffff" ? "border-neutral-300" : "border-transparent"
                                } ${selectedColor === color.id ? "shadow-[0_0_0_3px_black]" : ""}`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center flex-row items-center gap-4">
                        <select className="border border-black rounded-lg px-4 py-2 text-center">
                            <option value="font1">Inter</option>
                            <option value="font2">Font 2</option>
                            <option value="font3">Font 3</option>
                        </select>
                        <div className="bg-dark-blue rounded-full p-2">
                            <PiAlignCenterVertical className="text-4xl text-white" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};