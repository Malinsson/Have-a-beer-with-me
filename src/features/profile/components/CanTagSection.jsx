import { getTagLabelById } from "../../can-designer/constants.js";

const TAG_ASSETS = [TagRed, TagGreen, TagBlue];

import TagRed from "../../../assets/images/tags/tag-red.svg";
import TagGreen from "../../../assets/images/tags/tag-green.svg";
import TagBlue from "../../../assets/images/tags/tag-blue.svg";

export const CanTagSection = ({ backData }) => {
    return (
        <div className="flex gap-4 mb-8">

            {backData.tags?.slice(0, 3).map((tagId, index) => {
                const label = getTagLabelById(tagId);
                
                return (
                    <div key={tagId} className="flex flex-col items-center gap-2">
                        <span className="text-sm uppercase tracking-tighter">
                            {label}
                        </span>
                        <div className="w-8 h-8">
                            <img 
                                src={TAG_ASSETS[index]} 
                                alt={`${label} tag`} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                );
            })}
        </div>

    )}