import { useState } from 'react'

export const useImageSelection = () => {
  const [imageSrc, setImageSrc] = useState(null)

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageSrc(null)
  }

  return { imageSrc, onFileChange, clearImage }
}