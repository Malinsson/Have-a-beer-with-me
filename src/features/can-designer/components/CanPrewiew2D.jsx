import { useParams } from "react-router-dom";
import { useDesignStore } from "../../../store/designStore";
import { useProfileInfo } from "../../profile/hooks/useProfileInfo";
import { useUserSlug } from "../../profile/hooks/useUserSlug";

import baseCan from "../../../assets/images/baseCan.webp";
import { CanPreviewBack } from "./canPreview/CanPreviewBack.jsx";
import { CanPreviewFront } from "./canPreview/CanPreviewFront.jsx";


export const CanPreview2D = ({ side = "front", design = null, scale = 1, textScale = null }) => {
    const { slug: routeSlug } = useParams();
    const userSlug = useUserSlug();
    const effectiveSlug = routeSlug || userSlug || null;
    const { profile } = useProfileInfo(effectiveSlug);
    const nameFromStore = useDesignStore((state) => state.name);
    const frontFromStore = useDesignStore((state) => state.front);
    const backFromStore = useDesignStore((state) => state.back);
    const fontScale = textScale !== null ? textScale : scale;

    const useStoreData = !design;
    
    const name = useStoreData ? nameFromStore : { firstName: "", drinkType: "", ...(design?.name || {}) };

    // Prepare front and back data, prioritizing store data if useStoreData is true, otherwise using design prop or defaults
    const front = useStoreData
        ? frontFromStore
        : {
              imageUrl: null,
              imageTransform: { x: 0, y: 0, scale: 1 },
              texturePreset: "default",
              textColor: "#000000",
              textFont: "Inter, sans-serif",
              textAlignment: "center",
              ...(design?.front || {}),
          };
    const back = useStoreData
        ? {
              tags: [],
              description: "",
              department: "",
              socials: {},
              ...(backFromStore || {}),
          }
        : {
              tags: [],
              description: "",
              department: "",
              socials: {},
              ...(design?.back || {}),
          };

    //Label curve
    const labelClipStyle = {
        borderTopLeftRadius: "48% 1%",
        borderTopRightRadius: "48% 1%",
        borderBottomLeftRadius: "48% 3%",
        borderBottomRightRadius: "48% 3%",
    };

    const isFrontSide = side === "front";

    return (
        <div className="relative max-w-45 mx-auto" style={{ maxWidth: `${200 * scale}px` }}>
            <img src={baseCan} alt="Can template" className="w-full h-auto object-contain" />

            {/* Label area */}
            <div
                className="absolute left-1/2 top-[18.5%] -translate-x-1/2 w-[97.5%] h-[75%] overflow-hidden"
                style={labelClipStyle}
            >
            
                {isFrontSide && (
                    <CanPreviewFront 
                    front={front} 
                    name={name} 
                    fontScale={fontScale} 
                    />
                )}

                {!isFrontSide &&(
                    <CanPreviewBack 
                    back={back} 
                    profile={profile} 
                    effectiveSlug={effectiveSlug}
                    />
                )}
            </div>
        </div>
    );
};