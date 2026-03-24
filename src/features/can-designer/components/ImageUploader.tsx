import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useImageUploader } from '../hooks/useImageUploader.ts'


export function ImageUploader({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
    
  const { imageSrc, imgRef, onFileChange, crop, setCrop, handleUpload, uploading, error } =
    useImageUploader({ onUploadComplete })


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

          {error && <p role="alert">{error}</p>}
        </>
      )}
    </div>
  )
}

