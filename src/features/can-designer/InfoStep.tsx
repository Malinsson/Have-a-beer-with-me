import { ProgressDots } from "../../components/ProgressDots";
import { OPTIONS } from "./constants";

interface InfoStepProps {
    selected: Set<string>;
    onToggle: (id: string) => void;
}

export const InfoStep: React.FC<InfoStepProps> = ({ selected, onToggle }) => {
    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-wrap gap-3 justify-center">
                {OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onToggle(option.id)}
                        aria-pressed={selected.has(option.id)}
                        className={`border border-black rounded-full px-4 py-2 ${
                            selected.has(option.id) ? "bg-dark-blue text-white" : "bg-white text-black"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <div>
                <ProgressDots total={2} current={2} />
            </div>
        </div>
     );
}