import { useEffect, useRef } from "react";
import { useDesignStore } from "../../../../store/designStore";

export const useDesignHydration = ({ locationState, setBack, setFront, setName }) => {
    const hasHydratedRef = useRef(false);
    const isHydratingRef = useRef(true);

    useEffect(() => {
        const hydrateLatestDesign = async () => {
            try {
                const result = await useDesignStore.getState().loadLatestDesignForCurrentUser();
                const { firstName, lastName, drinkTypeId, drinkTypeLabel, department } = locationState || {};

                if (typeof firstName === "string" || typeof lastName === "string" || typeof drinkTypeLabel === "string") {
                    useDesignStore.getState().setName(firstName || "", lastName || "", drinkTypeLabel || "");
                }
                if (typeof drinkTypeId === "string" || typeof drinkTypeLabel === "string") {
                    useDesignStore.getState().setFront({
                        drinkTypeId: drinkTypeId || "",
                        drinkType: drinkTypeLabel || "",
                    });
                }
                if (typeof department === "string") {
                    useDesignStore.getState().setBack({ department });
                }
                if (!result.success && result.error !== "No design found" && result.error !== "User not authenticated") {
                    console.log("Failed to hydrate latest design:", result.error);
                }
            } finally {
                hasHydratedRef.current = true;
                isHydratingRef.current = false;
            }
        };

        hydrateLatestDesign();
    }, [locationState, setBack, setFront, setName]);

    return { hasHydratedRef, isHydratingRef };
};
