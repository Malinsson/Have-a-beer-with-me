import './App.css'
import { SignupForm } from './features/auth/components/SignupForm';
import { LoginForm } from './features/auth/components/LoginForm';
import { ListUsers } from './tests/ListUsers';
import { ImageUploader } from './features/can-designer/components/ImageUploader';
import { useSaveDesignImage } from './features/can-designer/hooks/useSaveDesignImage';



function App() {
  const { saveDesignImage } = useSaveDesignImage()

  const handleUploadComplete = async (url) => {
    try {
      await saveDesignImage(url)
      console.log('Bild uppladdad och sparat i designs.design_data.imageUrl:', url)
    } catch (error) {
      console.error('Kunde inte spara uppladdad bild URL i design_data.', error)
    }
  }

  return (
    <>
      <h1>Have a beer with me</h1>
      <SignupForm />
      <LoginForm />
      <ListUsers />
      <ImageUploader onUploadComplete={handleUploadComplete} />
    </>
  )
}

export default App
