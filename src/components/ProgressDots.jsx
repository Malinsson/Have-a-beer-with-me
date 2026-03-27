
export const ProgressDots = ({ total, current }) => {
    return (
        <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: total }, (_, index) => (
                <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${index < current ? 'bg-yrgo-red' : 'bg-gray-300'}`}
                />
            ))}
        </div>
    );
};