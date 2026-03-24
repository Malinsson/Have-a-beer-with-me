import { useState, useRef } from 'react'
import { type Crop } from 'react-image-crop'

export const useImageCrop = () => {
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)

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