import { useState, useRef, useEffect } from 'react'
import { type Crop } from 'react-image-crop'

export const useImageCrop = () => {
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)

  // Set default crop box when image loads
  useEffect(() => {
    const image = imgRef.current
    if (!image) return

    const handleImageLoad = () => {
      const size = Math.min(image.width, image.height) * 0.8
      const x = (image.width - size) / 2
      const y = (image.height - size) / 2

      setCrop({
        unit: 'px',
        x,
        y,
        width: size,
        height: size,
      })
    }

    if (image.complete) {
      handleImageLoad()
    } else {
      image.addEventListener('load', handleImageLoad)
      return () => image.removeEventListener('load', handleImageLoad)
    }
  }, [imgRef.current?.src])

  const getCroppedBlob = (): Promise<Blob> => {
    const image = imgRef.current!
    if (!image || !crop) {
      return Promise.reject(new Error('Bild eller beskärning saknas.'))
    }

    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop!.width
    canvas.height = crop!.height
    const ctx = canvas.getContext('2d')!

    ctx.drawImage(
      image,
      crop!.x * scaleX,
      crop!.y * scaleY,
      crop!.width * scaleX,
      crop!.height * scaleY,
      0, 0,
      crop!.width,
      crop!.height
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

  return { crop, setCrop, imgRef, getCroppedBlob }
}