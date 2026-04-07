import { useDesignStore } from "../../../store/designStore";
import baseCan from "../../../assets/images/baseCan.png";
import { TAGS, TEXT_ALIGNMENT } from "../constants";
import  logo  from "../../../assets/images/yrgo.png";

const TEXTURE_STYLES = {
    default: "linear-gradient(135deg, #f0f0f090 0%, #e2e2e290 100%)",
    "texture-1": "repeating-linear-gradient(135deg, #f7f7f790 0px, #f7f7f790 8px, #ececec90 8px, #ececec90 16px)",
    "texture-2": "radial-gradient(circle at 20% 20%, #0c8e4090 0%, #32adaf7f 40%, #1fa8ca90 100%)",
    "texture-3": "linear-gradient(180deg, #b126269d 0%, #250d0d90 55%, #95898989 100%)",
    "texture-4": "repeating-linear-gradient(90deg, #f2f2f290 0px, #f2f2f290 6px, #e4e4e490 6px, #e4e4e490 12px)",
};

export const CanPreview2D = ({ side = "front", design = null }) => {
    const nameFromStore = useDesignStore((state) => state.name);
    const frontFromStore = useDesignStore((state) => state.front);
    const backFromStore = useDesignStore((state) => state.back);

    const useStoreData = !design;
    const name = useStoreData ? nameFromStore : { firstName: "", drinkType: "", ...(design?.name || {}) };
    const front = useStoreData
        ? frontFromStore
        : {
              imageUrl: null,
              texturePreset: "default",
              textColor: "#000000",
              textFont: "Inter, sans-serif",
              textAlignment: "center",
              ...(design?.front || {}),
          };
    const back = useStoreData
        ? backFromStore
        : {
              tags: [],
              description: "",
              department: "",
              ...(design?.back || {}),
          };

    const tagLookup = TAGS.flatMap((group) => group.items).reduce((acc, tag) => {
        acc[tag.id] = tag.label;
        return acc;
    }, {});

    const textureBackground = TEXTURE_STYLES[front.texturePreset] || TEXTURE_STYLES.default;
    const textAlignClass = TEXT_ALIGNMENT[front.textAlignment] || TEXT_ALIGNMENT.center;

    const firstName = (name.firstName || "").trim();
    const firstNamePossessive = firstName
    ? `${firstName}${/s$/i.test(firstName) ? "'" : "'s"}`
    : "";

    const isFrontSide = side === "front";

    return (
        <div className="relative max-w-45 mx-auto">
            <img src={baseCan} alt="Can template" className="w-full h-auto object-contain" />

            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[98%] h-[72%] overflow-hidden">
            
                {isFrontSide && (
                <div>
                    <div className="absolute inset-0 bg-black/10" />

                        <div className={`absolute w-full h-full p-3 z-50 flex ${textAlignClass}`}>
                            <p
                                className="leading-tight text-[clamp(0.2rem,5vw,3rem)]"
                                style={{ color: front.textColor, fontFamily: front.textFont }}
                            >
                                {firstNamePossessive}
                                <br />
                                {name.drinkType}
                            </p>
                        </div>

                    
                    <div className="absolute inset-0 z-20" style={{ background: textureBackground }} />

                    {front.imageUrl && (
                        <img
                        src={front.imageUrl}
                        alt="Uploaded label"
                        className="absolute inset-0 w-full h-full object-cover z-5"
                        />
                    )}
                    </div>

                )}

                {!isFrontSide &&(
                    <div className=" absolute bg-white/80 border-4 border-yrgo-red my-[5%] mx-[10%] inset-0 p-2 flex flex-col items-center justify-between">
                        <div className="flex justify-start items-start gap-2 w-full">
                            <div className="flex w-full justify-between items-center">
                                <h5><strong>{back.department}</strong></h5>
                                <img src={logo} alt="Yrgo Logo" className="w-6 h-6 mt-1" />
                            </div>

                        </div>
                    

                    {!isFrontSide && !!back.description && (
                        
                        <div className="min-h-[30%] max-h-[50%] w-full overflow-clip">
                            <p
                                className="text-[10px] leading-tight normal-case"
                                >
                                {back.description}
                            </p>
                        </div>
                    )}

                        <div>
                            <p className="text-[10px] my-1 normal-case">Innehållsförteckning:</p>

                            {!isFrontSide && back.tags.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 justify-center">
                                {back.tags.slice(0, 3).map((tagId) => (
                                    <span key={tagId} className="text-[10px]">
                                        #{tagLookup[tagId] || tagId}
                                    </span>
                                ))}
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};