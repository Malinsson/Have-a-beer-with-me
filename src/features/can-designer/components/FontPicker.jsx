import { useEffect, useRef, useState } from "react";
import { FONTS } from "../constants";

export const FontPicker = ({ selectedFont, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedFontDef =
        FONTS.find((font) => font.style === selectedFont) || FONTS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (font) => {
        onSelect?.(font.style);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${isOpen ? "mb-24" : ""}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="w-full h-11 border border-black bg-white px-4 flex items-center justify-between text-lg"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Välj typsnitt"
            >
                <span style={{ fontFamily: selectedFontDef.style }} className="text-lg">
                    {selectedFontDef.label}
                </span>
                <span className="text-md" aria-hidden>
                    ▼
                </span>
            </button>

            {isOpen && (
                <ul
                    role="listbox"
                    className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto border border-black bg-white shadow-md"
                >
                    {FONTS.map((font) => {
                        const isSelected = font.style === selectedFontDef.style;
                        return (
                            <li key={font.id} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(font)}
                                    className={`w-full px-4 py-2 text-left text-md ${isSelected ? "bg-gray-100" : "bg-white"}`}
                                    style={{ fontFamily: font.style }}
                                >
                                    {font.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};