
export const ProgressDots = ({ total, current }) => {
    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length: total }, (_, index) => (
                <div
                    key={index}
                    aria-label="Progress dot"
                    pointer-events="none"
                    className={`w-2 h-2 rounded-full ${index < current ? 'bg-yrgo-red' : 'bg-gray-300'}`}
                />
            ))}
        </div>
    );
};