import { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export function ImageUploader({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Step 1 — user picks a file
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Step 2 — apply crop to a canvas and get a blob
  const getCroppedBlob = (): Promise<Blob> => {
    const image = imgRef.current!
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png')
    })
  }

  // Step 3 — upload cropped blob to Vercel Blob via API route
  const handleUpload = async () => {
    if (!crop) return
    setUploading(true)

    try {
      const blob = await getCroppedBlob()
      const formData = new FormData()
      formData.append('file', blob, 'label.png')

      const res = await fetch('/api/vercelBLOB', { method: 'POST', body: formData })
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
      }

      const { url } = await res.json()
      onUploadComplete(url)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onFileChange} />

      {imageSrc && (
        <>
          <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
            <img ref={imgRef} src={imageSrc} />
          </ReactCrop>

          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Laddar upp...' : 'Ladda upp'}
          </button>
        </>
      )}
    </div>
  )
}

