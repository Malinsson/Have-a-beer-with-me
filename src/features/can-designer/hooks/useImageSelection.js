import { useState } from 'react'

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const useImageSelection = () => {
  const [imageSrc, setImageSrc] = useState(null)
  const [selectionError, setSelectionError] = useState(null)

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageSrc(null)
      setSelectionError('Endast PNG, JPG, WEBP och GIF är tillåtna.')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageSrc(null)
      setSelectionError('Bilden är för stor. Max tillåten storlek är 10 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result)
      setSelectionError(null)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageSrc(null)
    setSelectionError(null)
  }

  return { imageSrc, selectionError, onFileChange, clearImage }
}