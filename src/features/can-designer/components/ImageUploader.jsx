import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useImageUploader } from '../hooks/useImageUploader'
import { GoUpload } from "react-icons/go";


export function ImageUploader({ onUploadComplete }) {
    
  const { imageSrc, imgRef, onFileChange, crop, setCrop, handleUpload, uploading, error, clearImage } =
    useImageUploader({ onUploadComplete })


  return (
    <div className="w-full min-h-16 flex items-center justify-center mx-4 relative">
      <label htmlFor='imageUploader' className="w-full flex items-center justify-between cursor-pointer">
        <div className="bg-gray-300 p-3 px-4">
          <GoUpload className="text-lg" />
        </div>
        <span className="uppercase text-lg">Ladda Upp</span>    
      </label>

      <input 
        id='imageUploader'
        type="file" 
        accept="image/*" 
        onChange={onFileChange}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />

      {imageSrc && (
        <section className="fixed inset-0 z-100 bg-black/50 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-xl p-4 md:p-6 flex flex-col">
            
            <h2 className="text-xl text-center mt-6">Klicka för att beskära bilden</h2>

            <div className="flex-1 overflow-auto flex flex-col items-center justify-center">

              <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
                <img ref={imgRef} src={imageSrc} alt="Image to crop" className="max-h-[70vh] object-contain" />
              </ReactCrop>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={clearImage}
                className="py-2 px-4 border border-black rounded-full"
              >
                Avbryt
              </button>


              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="py-2 px-4 bg-dark-blue text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {uploading ? 'Laddar upp...' : 'Ladda upp'}
              </button>
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

