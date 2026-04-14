import { useEffect, useRef } from "react";
import { useDrag, usePinch, useWheel } from "@use-gesture/react";
import baseCan from "../../../assets/images/baseCan.webp";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const DEFAULT_VALUE = { x: 0, y: 0, scale: 1 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Normalizes the input value for image transformation, ensuring that x, y, and scale are valid numbers with fallbacks to default values if necessary
const normalizeValue = (value) => ({
    x: Number.isFinite(value?.x) ? value.x : DEFAULT_VALUE.x,
    y: Number.isFinite(value?.y) ? value.y : DEFAULT_VALUE.y,
    scale: Number.isFinite(value?.scale) ? value.scale : DEFAULT_VALUE.scale,
});

export default function ImagePositioner({ imageUrl, value, onChange }) {
    const areaRef = useRef(null);
    const rafRef = useRef(null);
    const pendingTransformRef = useRef(null);
    const transform = normalizeValue(value);
    const liveTransformRef = useRef(transform);

    useEffect(() => {
        liveTransformRef.current = transform;
    }, [transform.x, transform.y, transform.scale]);

    // Clean up any pending animation frames when the component unmounts to prevent memory leaks or unintended updates
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Schedules an update to the image transformation, batching changes to optimize performance and prevent excessive re-renders during rapid interactions
    const scheduleChange = (nextTransform) => {
        if (!onChange) return;
        pendingTransformRef.current = nextTransform;
        liveTransformRef.current = nextTransform;

        if (rafRef.current) return;

        
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            if (pendingTransformRef.current) {
                onChange(pendingTransformRef.current);
            }
        });
    };

    // Updates the position of the image based on drag deltas, converting pixel movement to percentage and clamping within bounds
    const updatePosition = (startX, startY, deltaX, deltaY) => {
        const rect = areaRef.current?.getBoundingClientRect();
        if (!rect) return;

        const xDeltaPercent = (deltaX / rect.width) * 100;
        const yDeltaPercent = (deltaY / rect.height) * 100;

        scheduleChange({
            ...transform,
            x: clamp(startX + xDeltaPercent, -80, 80),
            y: clamp(startY + yDeltaPercent, -80, 80),
        });
    };

    useDrag(
        ({ first, movement: [mx, my], memo, event }) => {
            if (event.cancelable) event.preventDefault();
            const start = first ? [liveTransformRef.current.x, liveTransformRef.current.y] : memo;
            updatePosition(start[0], start[1], mx, my);
            return start;
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
            pointer: { touch: true, capture: false },
            threshold: 0,
            filterTaps: false,
        }
    );

    useWheel(
        ({ delta: [, dy], event }) => {
            if (event.cancelable) event.preventDefault();
            scheduleChange({
                ...liveTransformRef.current,
                scale: clamp(liveTransformRef.current.scale - dy * 0.0015, MIN_SCALE, MAX_SCALE),
            });
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
        }
    );

    usePinch(
        ({ offset: [scale], event }) => {
            if (event.cancelable) event.preventDefault();
            scheduleChange({
                ...liveTransformRef.current,
                scale: clamp(scale, MIN_SCALE, MAX_SCALE),
            });
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
            from: () => [transform.scale, 0],
            scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
            rubberband: false,
        }
    );

    return (
        <section className="w-full mt-2 mb-4">
            <div className="relative max-w-45 mx-auto w-full">
                <img src={baseCan} alt="Can template" className="w-full h-auto object-contain pointer-events-none" />

                <div
                    ref={areaRef}
                    className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[98%] h-[72%] overflow-hidden touch-none border border-dashed border-neutral-400"
                    style={{ cursor: "grab", touchAction: "none" }}
                >
                    <img
                        src={imageUrl}
                        alt="Position preview"
                        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                        draggable={false}
                        style={{
                            transform: `translate3d(${transform.x}%, ${transform.y}%, 0) scale(${transform.scale})`,
                            transformOrigin: "center center",
                            willChange: "transform",
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
