import { useState } from "react";
import { ProgressDots } from "../../components/ProgressDots";
import { Button } from "../../components/Button";
import { TAGS } from "./constants";

export const InfoStep = ({ selected, onToggle }) => {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const MAX_TAGS = 3;
    const count = selected.size;
    const visibleTagGroups = showAllCategories ? TAGS : TAGS.slice(0, 1);

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-wrap gap-3 justify-center">

                <h3 className="text-center my-2">JAG GILLAR ({count}/3)</h3>
                
                {visibleTagGroups.map((tagGroup) =>
                    <div key={tagGroup.category || "general"}>
                        {tagGroup.category && (
                            <h3 className="text-center my-2">{tagGroup.category.toLocaleUpperCase()}</h3>
                        )}

                        <div className="flex flex-wrap justify-center-safe gap-2">
                            {tagGroup.items.map((tag) => (
                                (() => {
                                    const isSelected = selected.has(tag.id);
                                    const isDisabled = !isSelected && count >= MAX_TAGS;

                                    return (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => onToggle(tag.id)}
                                            aria-pressed={isSelected}
                                            disabled={isDisabled}
                                            className={`border border-black px-4 py-2 ${
                                                isSelected ? "bg-dark-blue text-white" : "bg-white text-black"
                                            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {tag.label.toLocaleUpperCase()}
                                        </button>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                    )}
                </div>

            {TAGS.length > 1 && (
                <Button
                    className="inline-block max-w-fit"
                    text={showAllCategories ? "Visa mindre" : "Visa mer"}
                    onClick={() => setShowAllCategories((prev) => !prev)}
                    variant="primary"
                    type="button"
                />
            )}

            {count >= MAX_TAGS && (
                <p className="text-center text-sm text-neutral-600">Du kan välja max 3 tags.</p>
            )}
            <div>
                <ProgressDots total={4} current={2} />
            </div>
        </div>
     );
}