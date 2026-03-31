import { ProgressDots } from "../../components/ProgressDots";
import { TAGS } from "./constants";

export const InfoStep = ({ selected, onToggle }) => {
    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-wrap gap-3 justify-center">
                {TAGS.map((tag) => (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => onToggle(tag.id)}
                        aria-pressed={selected.has(tag.id)}
                        className={`border border-black rounded-full px-4 py-2 ${
                            selected.has(tag.id) ? "bg-dark-blue text-white" : "bg-white text-black"
                        }`}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>
            <div>
                <ProgressDots total={2} current={2} />
            </div>
        </div>
     );
}