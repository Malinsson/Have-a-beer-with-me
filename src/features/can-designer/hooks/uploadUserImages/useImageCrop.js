import { useRef, useState } from 'react'

export const useImageCrop = () => {
  const [crop, setCrop] = useState()
  const sourceImageRef = useRef(null)
  const displaySizeRef = useRef({ width: 0, height: 0 })

  const hasValidCrop = (value) => (
    value &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.width) &&
    Number.isFinite(value.height) &&
    value.width > 0 &&
    value.height > 0
  )

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

  const onImageLoad = (event) => {
    const loadedImage = event.currentTarget
    const displayWidth = loadedImage.width || loadedImage.clientWidth || 0
    const displayHeight = loadedImage.height || loadedImage.clientHeight || 0

    displaySizeRef.current = {
      width: displayWidth,
      height: displayHeight,
    }

    initializeCrop(displayWidth, displayHeight)

    const persistentImage = new Image()
    persistentImage.src = loadedImage.currentSrc || loadedImage.src

    persistentImage.onload = () => {
      sourceImageRef.current = persistentImage
    }

    if (persistentImage.complete) {
      sourceImageRef.current = persistentImage
    }
  }

  const getCroppedBlob = () => {
    const image = sourceImageRef.current
    if (!image) {
      return Promise.reject(new Error('Bild saknas.'))
    }

    const displayWidth = displaySizeRef.current.width || image.naturalWidth || image.width
    const displayHeight = displaySizeRef.current.height || image.naturalHeight || image.height

    if (!displayWidth || !displayHeight) {
      return Promise.reject(new Error('Bilden laddas fortfarande. Forsok igen.'))
    }

    const safeCrop = hasValidCrop(crop)
      ? crop
      : {
          unit: 'px',
          x: 0,
          y: 0,
          width: displayWidth,
          height: displayHeight,
        }

    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / displayWidth
    const scaleY = image.naturalHeight / displayHeight

    canvas.width = safeCrop.width
    canvas.height = safeCrop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return Promise.reject(new Error('Canvas-kontekst kunde inte skapas.'))
    }

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