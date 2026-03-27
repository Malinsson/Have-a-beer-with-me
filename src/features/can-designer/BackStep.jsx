import { ProgressDots } from "../../components/ProgressDots";

export const BackStep = ({ value, onChange }) => {
    return (
        <div className="flex flex-col justify-center mt-6">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Vad inspirerar dig mest?"
                className="border border-neutral-300 rounded-lg px-4 py-2 w-full h-32 resize-none"
            />
            <div>
                <ProgressDots total={2} current={1} />
            </div>
        </div>
     );
}

