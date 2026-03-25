import { useState } from 'react'

export const useBlobUpload = ({
  getCroppedBlob,
  onUploadComplete,
  onUploadSuccess,
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async () => {
    if (uploading) return
    setUploading(true)
    setError(null)

    try {
      const blob = await getCroppedBlob()
      const formData = new FormData()
      formData.append('file', blob, 'label.png')

      const res = await fetch('/api/vercelBLOB', { method: 'POST', body: formData })
      if (!res.ok) {
        const responseText = await res.text()
        throw new Error(responseText || `Uppladdningen misslyckades: ${res.status} ${res.statusText}`)
      }

      const { url } = await res.json()
      if (!url) {
        throw new Error('Uppladdningen lyckades men ingen bild-URL returnerades.')
      }

      onUploadComplete(url)
      onUploadSuccess?.()
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Uppladdningen misslyckades.'
      setError(message)
      console.error('Uppladdningsfel:', caughtError)
    } finally {
      setUploading(false)
    }
  }

  return { handleUpload, uploading, error }
}