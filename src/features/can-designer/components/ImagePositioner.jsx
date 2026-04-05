import { useRef } from "react";
import { useDrag, usePinch, useWheel } from "@use-gesture/react";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const DEFAULT_VALUE = { x: 0, y: 0, scale: 1 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeValue = (value) => ({
    x: Number.isFinite(value?.x) ? value.x : DEFAULT_VALUE.x,
    y: Number.isFinite(value?.y) ? value.y : DEFAULT_VALUE.y,
    scale: Number.isFinite(value?.scale) ? value.scale : DEFAULT_VALUE.scale,
});

export default function ImagePositioner({ imageUrl, value, onChange }) {
    const areaRef = useRef(null);
    const transform = normalizeValue(value);

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

    const resetTransform = () => {
        onChange?.(DEFAULT_VALUE);
    };

    return (
        <section className="w-full mt-2 mb-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Dra for att flytta. Skrolla eller nyp for att zooma.</p>
                <button
                    type="button"
                    onClick={resetTransform}
                    className="border px-3 py-1 text-sm"
                >
                    Aterstall
                </button>
            </div>

            <div
                ref={areaRef}
                className="relative mx-auto w-55 h-75 overflow-hidden border border-dashed border-neutral-400 bg-neutral-50 touch-none"
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
        </section>
    );
}
