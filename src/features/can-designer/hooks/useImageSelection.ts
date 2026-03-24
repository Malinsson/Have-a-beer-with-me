import { useState } from 'react'

export const useImageSelection = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageSrc(null)
  }

  return { imageSrc, onFileChange, clearImage }
}