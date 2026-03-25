import './App.css'
import { useState } from 'react';
import { SignupForm } from './features/auth/components/SignupForm';
import { LoginForm } from './features/auth/components/LoginForm';
import { ListUsers } from './tests/ListUsers';
import { ImageUploader } from './features/can-designer/components/ImageUploader';
import { useSaveDesignImage } from './features/can-designer/hooks/useSaveDesignImage';
import ProfileQRCode from './shared/components/ProfileQRCode';



function App() {

  const { saveDesignImage } = useSaveDesignImage()
  const [latestDesignId, setLatestDesignId] = useState(null)

  const handleUploadComplete = async (url) => {
    try {
      const designId = await saveDesignImage(url)
      setLatestDesignId(designId)
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
      <ProfileQRCode designId={latestDesignId} size={256} />
    </>
  )
}

export default App
