import { useEffect, useRef } from "react";
import { useDesignStore } from "../../../../store/designStore";
import { invokeDesignerBootstrap } from "./designerBootstrap";

const isObject = (value) => value !== null && typeof value === "object";

const applyBootstrapDesignToStore = (payload) => {
    const latestDesign = payload?.latestDesign;
    if (!isObject(latestDesign)) return false;

    const designData = isObject(latestDesign.design_data) ? latestDesign.design_data : {};
    const nameData = isObject(designData.name) ? designData.name : {};
    const frontData = isObject(designData.front) ? designData.front : {};
    const backData = isObject(designData.back) ? designData.back : {};

    useDesignStore.getState().setName(
        typeof nameData.firstName === "string" ? nameData.firstName : "",
        typeof nameData.lastName === "string" ? nameData.lastName : "",
        typeof nameData.drinkType === "string" ? nameData.drinkType : ""
    );

    useDesignStore.getState().setFront(frontData);
    useDesignStore.getState().setBack({
        ...backData,
        socials: isObject(backData.socials) ? backData.socials : {},
    });

    useDesignStore.setState((state) => ({
        ...state,
        currentShareId: latestDesign.share_id || state.currentShareId || null,
    }));

    return true;
};

export const useDesignHydration = ({ locationState, setBack, setFront, setName }) => {
    const hasHydratedRef = useRef(false);
    const isHydratingRef = useRef(true);

    useEffect(() => {
        const hydrateLatestDesign = async () => {
            try {
                let result = { success: false, error: "No design found" };

                const { data, error } = await invokeDesignerBootstrap();
                if (!error && applyBootstrapDesignToStore(data)) {
                    result = { success: true };
                } else if (!error && data?.auth?.isAuthenticated === false) {
                    result = { success: true };
                } else if (error) {
                    result = { success: false, error: error.message };
                }

                if (!result.success) {
                    result = await useDesignStore.getState().loadLatestDesignForCurrentUser();
                }

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
