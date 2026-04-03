import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useImageUploader } from '../hooks/uploadUserImages/useImageUploader'
import { GoUpload } from "react-icons/go";
import { Button } from '../../../components/Button';


export function ImageUploader({ onUploadComplete }) {
    
  const { imageSrc, imgRef, onFileChange, crop, setCrop, handleUpload, uploading, error, clearImage } =
    useImageUploader({ onUploadComplete })


  return (
    <div className="w-full min-h-15 flex items-center justify-center mx-4 relative">
      <label htmlFor='imageUploader' className="w-full flex items-center justify-center">
        <div className="p-3">
          <GoUpload className="text-base" />
        </div>
        <span className="uppercase text-md">Ladda Upp</span>    
      </label>

      <input 
        id='imageUploader'
        type="file" 
        accept="image/*" 
        onChange={onFileChange}
        className="absolute inset-0 opacity-0 w-full h-full"
      />

      {imageSrc && (
        <section className="fixed inset-0 z-100 bg-black/70 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[85vh] bg-white p-4 md:p-6 flex flex-col">
            
            <h2 className="text-2xl text-center mt-10">Klicka för att beskära bilden</h2>

            <div className="flex-1 overflow-auto flex flex-col items-center justify-center">

              <ReactCrop crop={crop} onChange={setCrop} aspect={3/4}>
                <img ref={imgRef} src={imageSrc} alt="Image to crop" className="max-h-[70vh] object-contain" />
              </ReactCrop>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Button
                type="button"
                onClick={clearImage}
                variant="outlined"
                text="Avbryt"
              >
              </Button>


              <Button
                type="submit"
                onClick={handleUpload}
                disabled={uploading}
                text={uploading ? 'Laddar upp...' : 'Ladda upp'}
                variant="primary"
              >
              </Button>
            </div>

          </div>
        </section>
      )}

      {error && !imageSrc && (
        <p role="alert" className="absolute -bottom-11 left-0 text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

