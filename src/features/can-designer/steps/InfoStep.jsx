import { useState } from "react";
import { TAGS } from "../constants";
import React from "react";

export const InfoStep = ({ selected, onToggle }) => {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const MAX_TAGS = 3;
    const count = selected.size;
    const visibleTagGroups = showAllCategories ? TAGS : TAGS.slice(0, 1);

    return (
        <div className="flex flex-col mt-6">
            <div className="flex flex-wrap gap-2 justify-center">

                <p className="bold w-full mb-2">JAG GILLAR ({count}/3)</p>
                
                {visibleTagGroups.map((tagGroup) =>
                    <React.Fragment key={tagGroup.category || "general"}>
                        {showAllCategories && tagGroup.category && (
                            <p className="bold w-full my-2 uppercase ">
                                {tagGroup.category}</p>
                        )}

                        {tagGroup.items.map((tag) => {
                        
                            const isSelected = selected.has(tag.id);
                            const isDisabled = !isSelected && count >= MAX_TAGS;

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => onToggle(tag.id)}
                                    aria-pressed={isSelected}
                                    disabled={isDisabled}
                                    className={`border px-4 py-2  ${
                                        isSelected ? "bg-dark-blue text-white" : "bg-white text-black"
                                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {tag.label.toLocaleUpperCase()}
                                </button>
                            );
                        })}
                    </React.Fragment>
                )}
                {!showAllCategories && TAGS.length > 1 && (
                    <button 
                        className="bg-dark-blue text-white px-4 py-2 uppercase" 
                        onClick={() => setShowAllCategories(true)}
                    >
                        Se fler
                    </button>
                )}
            </div>
                {showAllCategories && (
                    <div className="flex justify-center mt-2">
                        <button 
                            className="bg-dark-blue text-white px-4 py-2 uppercase" 
                            onClick={() => setShowAllCategories(false)}
                        >   
                            Visa mindre
                        </button>
                    </div>
                )}
                    
              

            {count >= MAX_TAGS && (
                <p className="text-center text-sm text-neutral-600">Du kan välja max 3 tags.</p>
            )}
            
        </div>
     );
}