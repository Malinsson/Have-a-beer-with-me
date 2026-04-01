import { useDesignStore } from "../../../store/designStore";

export const CanPreview2D = () => {
    const { front, back } = useDesignStore();
    return (
        <div className="w-full max-w-sm h-[50vh] bg-gray-200 rounded-lg overflow-hidden relative">
            <img src={front.texturePreset} alt="Can preview" className="w-full h-full object-cover" />
            {front.textColor && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: front.textColor }}>
                        Din Design
                    </span>
                </div>
            )}
        </div>
    );
}