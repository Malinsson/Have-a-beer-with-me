import { useDesignStore } from "../../../store/designStore";
import baseCan from "../../../assets/images/baseCan.png";
import { TAGS, TEXT_ALIGNMENT } from "../constants";

const TEXTURE_STYLES = {
    default: "linear-gradient(135deg, #f0f0f0 0%, #e2e2e2 100%)",
    "texture-1": "repeating-linear-gradient(135deg, #f7f7f7 0px, #f7f7f7 8px, #ececec 8px, #ececec 16px)",
    "texture-2": "radial-gradient(circle at 20% 20%, #ffffff 0%, #f0f0f0 40%, #d7d7d7 100%)",
    "texture-3": "linear-gradient(180deg, #f9f9f9 0%, #ececec 55%, #dcdcdc 100%)",
    "texture-4": "repeating-linear-gradient(90deg, #f2f2f2 0px, #f2f2f2 6px, #e4e4e4 6px, #e4e4e4 12px)",
};

export const CanPreview2D = () => {
    const name = useDesignStore((state) => state.name);
    const front = useDesignStore((state) => state.front);
    const back = useDesignStore((state) => state.back);

    const tagLookup = TAGS.flatMap((group) => group.items).reduce((acc, tag) => {
        acc[tag.id] = tag.label;
        return acc;
    }, {});

    const headingText = [name.firstName, name.lastName].filter(Boolean).join(" ") || "DIN DESIGN";
    const textureBackground = TEXTURE_STYLES[front.texturePreset] || TEXTURE_STYLES.default;
    const textAlignClass = TEXT_ALIGNMENT[front.textAlignment] || TEXT_ALIGNMENT.center;

    return (
        <div className="relative max-w-45 mx-auto">
            <img src={baseCan} alt="Can template" className="w-full h-auto object-contain" />

            <div className="absolute left-1/2 top-[15%] -translate-x-1/2 w-[58%] h-[62%] overflow-hidden border border-black/10">
                <div className="absolute inset-0" style={{ background: textureBackground }} />

                {front.imageUrl && (
                    <img
                        src={front.imageUrl}
                        alt="Uploaded label"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-black/10" />

                <div className={`absolute left-0 right-0 top-6 px-3 ${textAlignClass}`}>
                    <p
                        className="font-bold uppercase leading-tight"
                        style={{ color: front.textColor, fontFamily: front.textFont }}
                    >
                        {headingText}
                    </p>
                </div>

                {!!back.description && (
                    <div className={`absolute left-0 right-0 bottom-12 px-3 ${textAlignClass}`}>
                        <p
                            className="text-xs leading-tight"
                            style={{ color: front.textColor, fontFamily: front.textFont }}
                        >
                            {back.description.slice(0, 120)}
                        </p>
                    </div>
                )}

                {back.tags.length > 0 && (
                    <div className="absolute left-2 right-2 bottom-2 flex flex-wrap gap-1 justify-center">
                        {back.tags.slice(0, 3).map((tagId) => (
                            <span key={tagId} className="text-[10px] px-2 py-0.5 border border-black/40 bg-white/70">
                                #{tagLookup[tagId] || tagId}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};