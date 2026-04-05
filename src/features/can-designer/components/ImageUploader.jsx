import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useEffect, useRef, useState } from 'react'
import { useDrag, usePinch, useWheel } from "@use-gesture/react";
import { useImageUploader } from '../hooks/uploadUserImages/useImageUploader'
import { GoUpload } from "react-icons/go";
import { Button } from '../../../components/Button';

// --- Constants ---
const DEFAULT_IMAGE_TRANSFORM = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const STEPS = { CROP: 'crop', POSITION: 'position' }

// --- Helpers ---
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeValue = (value) => ({
  x: Number.isFinite(value?.x) ? value.x : DEFAULT_IMAGE_TRANSFORM.x,
  y: Number.isFinite(value?.y) ? value.y : DEFAULT_IMAGE_TRANSFORM.y,
  scale: Number.isFinite(value?.scale) ? value.scale : DEFAULT_IMAGE_TRANSFORM.scale,
});

// --- Image Positioner ---
function ImagePositioner({ imageUrl, value, onChange }) {
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
    { target: areaRef, eventOptions: { passive: false }, pointer: { touch: true } }
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
    { target: areaRef, eventOptions: { passive: false } }
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

// --- Main Component ---
export function ImageUploader({ onUploadComplete }) {
  const [step, setStep] = useState(STEPS.CROP)
  const [imageTransform, setImageTransform] = useState(DEFAULT_IMAGE_TRANSFORM)

  const { imageSrc, onImageLoad, onFileChange, crop, setCrop, handleUpload, uploading, error, clearImage } =
    useImageUploader({ onUploadComplete })

  // Reset everything when image is cleared
  useEffect(() => {
    if (!imageSrc) {
      setImageTransform(DEFAULT_IMAGE_TRANSFORM)
      setStep(STEPS.CROP)
    }
  }, [imageSrc])

  const handleBack = () => setStep(STEPS.CROP)

  const handleResetTransform = () => setImageTransform(DEFAULT_IMAGE_TRANSFORM)

  return (
    <div className="w-full min-h-15 flex items-center justify-center mx-4 relative">

      {/* Upload trigger */}
      <label htmlFor='imageUploader' className="w-full flex items-center justify-center">
        <div className="p-3">
          <GoUpload className="text-base" />
        </div>
        <span className="uppercase text-md">Ladda Upp</span>
      </label>

      <input
        id='imageUploader'
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="absolute inset-0 opacity-0 w-full h-full"
      />

      {/* Modal */}
      {imageSrc && (
        <section className="fixed inset-0 z-100 bg-black/70 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[85vh] bg-white p-4 md:p-6 flex flex-col">

            {/* Header */}
            <h2 className="text-2xl text-center mt-10">
              {step === STEPS.CROP ? 'Beskär din bild' : 'Positionera din bild'}
            </h2>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-4">
              <span className={`text-sm ${step === STEPS.CROP ? 'font-bold' : 'text-neutral-400'}`}>
                1. Beskär
              </span>
              <span className="text-neutral-300">→</span>
              <span className={`text-sm ${step === STEPS.POSITION ? 'font-bold' : 'text-neutral-400'}`}>
                2. Positionera
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto flex flex-col items-center justify-center">

              {/* Step 1 — Crop */}
              {step === STEPS.CROP && (
                <ReactCrop crop={crop} onChange={setCrop}>
                  <img
                    src={imageSrc}
                    alt="Image to crop"
                    onLoad={onImageLoad}
                    className="max-h-[60vh] object-contain"
                  />
                </ReactCrop>
              )}

              {/* Step 2 — Position */}
              {step === STEPS.POSITION && (
                <>
                  <p className="text-sm text-neutral-500 mb-2">
                    Dra för att flytta · Skrolla eller nyp för att zooma
                  </p>
                  <ImagePositioner
                    imageUrl={imageSrc}
                    value={imageTransform}
                    onChange={setImageTransform}
                  />
                  <button
                    type="button"
                    onClick={handleResetTransform}
                    className="border px-3 py-1 text-sm mt-2"
                  >
                    Återställ position
                  </button>
                </>
              )}
            </div>

            {/* Footer buttons */}
            <div className="mt-4 flex items-center justify-between gap-3">

              {/* Left — cancel or back */}
              {step === STEPS.CROP ? (
                <Button
                  type="button"
                  onClick={clearImage}
                  variant="outlined"
                  text="Avbryt"
                />
              ) : (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outlined"
                  text="Tillbaka"
                />
              )}

              {/* Right — next or upload */}
              {step === STEPS.CROP ? (
                <Button
                  type="button"
                  onClick={() => setStep(STEPS.POSITION)}
                  variant="primary"
                  text="Nästa"
                  disabled={!crop}
                />
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleUpload({ imageTransform })}
                  disabled={uploading || !crop}
                  text={uploading ? 'Laddar upp...' : 'Ladda upp'}
                  variant="primary"
                />
              )}
            </div>

          </div>
        </section>
      )}

      {/* Error */}
      {error && !imageSrc && (
        <p role="alert" className="absolute -bottom-11 left-0 text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

