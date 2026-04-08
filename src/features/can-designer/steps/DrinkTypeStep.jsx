import { TYPES } from "../constants";

// Renamed props for clarity: 'selected' is now a single value, 'onSelect' replaces 'onToggle'
export const DrinkTypeStep = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-col gap-4 my-6">
            <div className="flex flex-wrap gap-3 mx-5 justify-center">
                {TYPES.map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        // Passes the ID directly; the parent state will now just store this one ID
                        onClick={() => onSelect(type.id)}
                        // Strict equality check for single selection
                        aria-pressed={selected === type.id}
                        className={`border px-4 py-2 transition-colors uppercase ${
                            selected === type.id 
                                ? "bg-blue-950 text-white border-blue-950" 
                                : "bg-white text-black hover:bg-gray-100"
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
     );
}