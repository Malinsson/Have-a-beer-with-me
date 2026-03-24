import { useImageSelection } from './useImageSelection'
import { useImageCrop } from './useImageCrop'
import { useBlobUpload } from './useBlobUpload'


// Combines image selection, cropping, and uploading into a single hook for easier use in components
type UseImageUploaderParams = {
  onUploadComplete: (url: string) => void
}

export const useImageUploader = ({ onUploadComplete }: UseImageUploaderParams) => {
  const { imageSrc, onFileChange, clearImage } = useImageSelection()
  const { crop, setCrop, imgRef, getCroppedBlob } = useImageCrop()

  const clearAfterUpload = () => {
    clearImage()
    setCrop(undefined)
  }

  const { handleUpload, uploading, error } = useBlobUpload({
    getCroppedBlob,
    onUploadComplete,
    onUploadSuccess: clearAfterUpload,
  })

  return {
    imageSrc,
    crop,
    setCrop,
    imgRef,
    onFileChange,
    clearImage: clearAfterUpload,
    handleUpload,
    uploading,
    error,
  }
}
