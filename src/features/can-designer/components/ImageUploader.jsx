import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useImageUploader } from '../hooks/useImageUploader'
import './ImageUploader.css'


export function ImageUploader({ onUploadComplete }) {
    
  const { imageSrc, imgRef, onFileChange, crop, setCrop, handleUpload, uploading, error } =
    useImageUploader({ onUploadComplete })


  return (
    <div className="image-uploader">
      <input 
        type="file" 
        accept="image/*" 
        onChange={onFileChange}
        className="file-input"
      />

      {imageSrc && (
        <div className="crop-container">
          <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
            <img ref={imgRef} src={imageSrc} alt="Image to crop" />
          </ReactCrop>

          <button onClick={handleUpload} disabled={uploading} className="upload-btn">
            {uploading ? 'Laddar upp...' : 'Ladda upp'}
          </button>

          {error && <p role="alert" className="error-message">{error}</p>}
        </div>
      )}
    </div>
  )
}

