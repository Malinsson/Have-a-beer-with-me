import { useEffect, useRef } from "react";
import { useDesignStore } from "../stores/designStore";


export const useDesignAutosave = ({state}) => {

        const timerRef = useRef(null);
            const unsubscribe = useDesignStore.subscribe((state, prevState) => {
            if (!hasHydratedRef.current || isHydratingRef.current) {
                return;
            }

            const changed = 
            state.front !== prevState.front ||
            state.back !== prevState.back;
            
            if (!changed) return;
            
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
                const result = await useDesignStore.getState().saveDesign("Draft");
                if (!result.success) {
                    console.log("Auto-save failed:", result.error);
                }
            }, 1000);
        });

    };

    

