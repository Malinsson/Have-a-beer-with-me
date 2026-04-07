import { ProgressDots } from "../../../components/ProgressDots";

export const BackStep = ({ value, onChange }) => {
    return (
        <div className="flex flex-col justify-center mt-6">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Text om..."
                maxLength={140}
                className="border border-neutral-300 px-4 py-2 w-full h-32 resize-none"
            />
            <div className="mt-6">
                <ProgressDots total={4} current={1} />
            </div>
        </div>
     );
}

