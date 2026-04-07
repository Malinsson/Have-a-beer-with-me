import { useRef } from "react";
import { useDrag, usePinch, useWheel } from "@use-gesture/react";
import baseCan from "../../../assets/images/baseCan.png";

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
    const transform = normalizeValue(value);

    // Updates the position of the image based on drag deltas, converting pixel movement to percentage and clamping within bounds
    const updatePosition = (deltaX, deltaY) => {
        const rect = areaRef.current?.getBoundingClientRect();
        if (!rect || !onChange) return;

        const xDeltaPercent = (deltaX / rect.width) * 100;
        const yDeltaPercent = (deltaY / rect.height) * 100;

        onChange({
            ...transform,
            x: clamp(transform.x + xDeltaPercent, -80, 80),
            y: clamp(transform.y + yDeltaPercent, -80, 80),
        });
    };

    useDrag(
        ({ delta: [dx, dy], event }) => {
            event.preventDefault();
            updatePosition(dx, dy);
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
            pointer: { touch: true },
        }
    );

    useWheel(
        ({ delta: [, dy], event }) => {
            event.preventDefault();
            if (!onChange) return;

            onChange({
                ...transform,
                scale: clamp(transform.scale - dy * 0.0015, MIN_SCALE, MAX_SCALE),
            });
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
        }
    );

    usePinch(
        ({ offset: [scale], event }) => {
            event.preventDefault();
            if (!onChange) return;

            onChange({
                ...transform,
                scale: clamp(scale, MIN_SCALE, MAX_SCALE),
            });
        },
        {
            target: areaRef,
            eventOptions: { passive: false },
            scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
            rubberband: true,
        }
    );

    return (
        <section className="w-full mt-2 mb-4">
            <div className="relative max-w-45 mx-auto w-full">
                <img src={baseCan} alt="Can template" className="w-full h-auto object-contain pointer-events-none" />

                <div
                    ref={areaRef}
                    className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[98%] h-[72%] overflow-hidden touch-none border border-dashed border-neutral-400"
                    style={{ cursor: "grab" }}
                >
                    <img
                        src={imageUrl}
                        alt="Position preview"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                        style={{
                            transform: `translate(${transform.x}%, ${transform.y}%) scale(${transform.scale})`,
                            transformOrigin: "center center",
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
