import { useRef, useState } from 'react'

export const useImageCrop = () => {
  const [crop, setCrop] = useState()
  const sourceImageRef = useRef(null)
  const displaySizeRef = useRef({ width: 0, height: 0 })

  // Validates that the crop object has all necessary numeric properties and positive dimensions
  const hasValidCrop = (value) => (
    value &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.width) &&
    Number.isFinite(value.height) &&
    value.width > 0 &&
    value.height > 0
  )

  // Initializes the crop area to a centered rectangle with a 3:4 aspect ratio, sized at 80% of the smaller image dimension
  const initializeCrop = (width, height) => {
    if (!width || !height) return

    const size = Math.min(width, height) * 0.8
    const x = (width - size) / 2
    const y = (height - size) / 2

    setCrop({
      unit: 'px',
      x,
      y,
      width: size * 0.75, // 3:4 aspect ratio
      height: size,
    })
  }

  // Handles image load event to set up the crop area and store a persistent reference to the loaded image for cropping
  const onImageLoad = (event) => {
    const loadedImage = event.currentTarget
    const displayWidth = loadedImage.width || loadedImage.clientWidth || 0
    const displayHeight = loadedImage.height || loadedImage.clientHeight || 0

    // Store the display size for later use in cropping calculations
    displaySizeRef.current = {
      width: displayWidth,
      height: displayHeight,
    }

    initializeCrop(displayWidth, displayHeight)

    // Create a persistent image reference to ensure the original image data is available for cropping, even if the displayed image changes
    const persistentImage = new Image()
    persistentImage.src = loadedImage.currentSrc || loadedImage.src

    persistentImage.onload = () => {
      sourceImageRef.current = persistentImage
    }

    if (persistentImage.complete) {
      sourceImageRef.current = persistentImage
    }
  }

  // Generates a cropped image blob from the source image based on the current crop area
  const getCroppedBlob = () => {
    const image = sourceImageRef.current
    if (!image) {
      return Promise.reject(new Error('Bild saknas.'))
    }

    const displayWidth = displaySizeRef.current.width || image.naturalWidth || image.width
    const displayHeight = displaySizeRef.current.height || image.naturalHeight || image.height

    if (!displayWidth || !displayHeight) {
      return Promise.reject(new Error('Bilden laddas fortfarande. Försök igen.'))
    }

    // Ensure we have a valid crop area, defaulting to the entire image if not
    const safeCrop = hasValidCrop(crop)
      ? crop
      : {
          unit: 'px',
          x: 0,
          y: 0,
          width: displayWidth,
          height: displayHeight,
        }

    // Create a canvas to draw the cropped image, scaling the crop coordinates from the displayed image size to the original image size
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / displayWidth
    const scaleY = image.naturalHeight / displayHeight

    // Set the canvas size to the dimensions of the crop area
    canvas.width = safeCrop.width
    canvas.height = safeCrop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return Promise.reject(new Error('Canvas-kontekst kunde inte skapas.'))
    }

    // Draw the cropped area of the original image onto the canvas, applying the necessary scaling to account for any difference between the displayed image size and the original image size
    ctx.drawImage(
      image,
      safeCrop.x * scaleX,
      safeCrop.y * scaleY,
      safeCrop.width * scaleX,
      safeCrop.height * scaleY,
      0, 0,
      safeCrop.width,
      safeCrop.height
    )

    // Convert the canvas content to a blob, which can be uploaded
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Misslyckades att skapa beskuren bild.'))
          return
        }
        resolve(blob)
      }, 'image/png')
    })
  }

  return { crop, setCrop, onImageLoad, getCroppedBlob }
}