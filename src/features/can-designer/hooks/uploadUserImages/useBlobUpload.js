import { useState } from 'react'

const asyncNoop = async () => {}

export const useBlobUpload = ({
  getCroppedBlob,
  onUploadComplete = asyncNoop,
  onUploadSuccess
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (extraData = {}) => {
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
        let serverMessage = responseText

        try {
          const parsed = JSON.parse(responseText)
          if (parsed?.error) {
            serverMessage = parsed.error
          }
        } catch {
          // Keep plain text if response is not JSON.
        }

        throw new Error(serverMessage || `Uppladdningen misslyckades: ${res.status} ${res.statusText}`)
      }

      const { url } = await res.json()
      if (!url) {
        throw new Error('Uppladdningen lyckades men ingen bild-URL returnerades.')
      }

      await Promise.resolve(onUploadComplete(url, extraData))
      onUploadSuccess?.()
      console.log('Uppladdning lyckades, bild-URL:', url)
      
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