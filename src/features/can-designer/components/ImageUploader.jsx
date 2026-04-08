import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useEffect, useState } from 'react'
import { useImageUploader } from '../hooks/uploadUserImages/useImageUploader'
import { GoUpload } from "react-icons/go";
import ImagePositioner from './ImagePositioner';
import { ImageUploadFooterActions } from './ImageUploadFooterActions';

// --- Constants ---
const DEFAULT_IMAGE_TRANSFORM = { x: 0, y: 0, scale: 1 };
const STEPS = { CROP: 'crop', POSITION: 'position' }

// --- Main Component ---
export function ImageUploader({ onUploadComplete }) {
  const [step, setStep] = useState(STEPS.CROP)
  const [imageTransform, setImageTransform] = useState(DEFAULT_IMAGE_TRANSFORM)
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState('')
  const [preparingPreview, setPreparingPreview] = useState(false)

  const { imageSrc, onImageLoad, onFileChange, crop, setCrop, getCroppedBlob, handleUpload, uploading, error, clearImage } =
    useImageUploader({ onUploadComplete })

  // Reset everything when image is cleared
  useEffect(() => {
    if (!imageSrc) {
      setImageTransform(DEFAULT_IMAGE_TRANSFORM)
      setStep(STEPS.CROP)
    }
  }, [imageSrc])


// Clean up the object URL for the cropped preview when it changes or when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl)
      }
    }
  }, [croppedPreviewUrl])

  const handleBack = () => setStep(STEPS.CROP)

  const handleResetTransform = () => setImageTransform(DEFAULT_IMAGE_TRANSFORM)

  const handleNext = async () => {
    if (!crop || preparingPreview) return

    setPreparingPreview(true)
    try {
      const croppedBlob = await getCroppedBlob()
      const previewUrl = URL.createObjectURL(croppedBlob)
      setCroppedPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl)
        }
        return previewUrl
      })
      setStep(STEPS.POSITION)
    } catch (caughtError) {
      console.error('Kunde inte skapa beskuren förhandsvisning:', caughtError)
    } finally {
      setPreparingPreview(false)
    }
  }

  return (
    <div className="w-full min-h-15 flex items-center justify-center mx-4 relative">

      {/* Upload button */}
      <label htmlFor='imageUploader' className="w-full flex items-center justify-center">
        <div className="p-3">
          <GoUpload className="text-base" />
        </div>
        <span className="uppercase text-md">Ladda Upp</span>
      </label>

      <input
        id='imageUploader'
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        onChange={onFileChange}
        className="absolute inset-0 opacity-0 w-full h-full"
      />

      {/* Modal */}
      {imageSrc && (
        <section className="fixed inset-0 z-100 bg-black/70 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[85vh] bg-white p-4 md:p-6 flex flex-col">

            {/* Header */}
            <h2 className="text-2xl text-center mt-4">
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
                    imageUrl={croppedPreviewUrl || imageSrc}
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

            <ImageUploadFooterActions
              step={step}
              uploading={uploading}
              preparingPreview={preparingPreview}
              hasCrop={!!crop}
              onCancel={clearImage}
              onBack={handleBack}
              onNext={handleNext}
              onUpload={() => handleUpload({ imageTransform })}
            />

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

