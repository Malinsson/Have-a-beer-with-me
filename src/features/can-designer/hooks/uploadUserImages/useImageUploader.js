import { useImageSelection } from './useImageSelection'
import { useImageCrop } from './useImageCrop'
import { useBlobUpload } from './useBlobUpload'


// Combines image selection, cropping, and uploading into a single hook for easier use in components
export const useImageUploader = ({ onUploadComplete }) => {
    
  const { imageSrc, selectionError, onFileChange, clearImage } = useImageSelection()
  const { crop, setCrop, onImageLoad, getCroppedBlob } = useImageCrop()

  const clearAfterUpload = () => {
    clearImage()
    setCrop(undefined)
  }

  const { handleUpload, uploading, error: uploadError } = useBlobUpload({
    getCroppedBlob,
    onUploadComplete,
    onUploadSuccess: clearAfterUpload,
  })

  return {
    imageSrc,
    crop,
    setCrop,
    onImageLoad,
    onFileChange,
    clearImage: clearAfterUpload,
    getCroppedBlob,
    handleUpload,
    uploading,
    error: selectionError || uploadError,
  }
}
