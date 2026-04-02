import { TEXT_ALIGNMENT } from "../constants";
import { PiAlignBottom, PiAlignCenterVertical, PiAlignTop  } from "react-icons/pi";

const ORDER = TEXT_ALIGNMENT ? Object.keys(TEXT_ALIGNMENT) : ["top", "center", "bottom"];

const LABEL = [
    {top: "Topp", icon: <PiAlignTop className="text-2xl"/> },
    {center: "Centrera", icon: <PiAlignCenterVertical className="text-2xl"/> },
    {bottom: "Nertill", icon: <PiAlignBottom className="text-2xl"/> },
];

export const AlignmentToggle = ({ value = "center", onChange }) => {
    const currentIndex = ORDER.indexOf(value);
    const safeIndex = currentIndex === -1 ? 1 : currentIndex;

    const handleClick = () => {
        const nextIndex = (safeIndex + 1) % ORDER.length;
        onChange?.(ORDER[nextIndex]);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="bg-dark-blue px-4 py-2 text-white text-sm"
            aria-label="Byt textjustering "{...LABEL.find(item => item[ORDER[safeIndex]])?.label || "?"}
            title="Byt textjustering"
        >
            {LABEL.find(item => item[ORDER[safeIndex]])?.icon || "?"}
        </button>
    );
};
