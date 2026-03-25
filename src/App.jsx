import './App.css'
import { SignupForm } from './features/auth/components/SignupForm';
import { LoginForm } from './features/auth/components/LoginForm';
import { ListUsers } from './tests/ListUsers';
import { ImageUploader } from './features/can-designer/components/ImageUploader';
import { CanPreview3D } from './features/can-designer/components/CanPreview3D';



function App() {
  const handleUploadComplete = (url) => {
    console.log('Image uploaded:', url)
    // TODO: Store uploaded image URL or use it in the beer can designer
  }

  return (
    <>
      <h1>Have a beer with me</h1>
      <SignupForm />
      <LoginForm />
      <ListUsers />
      <ImageUploader onUploadComplete={handleUploadComplete} />
      <CanPreview3D />
    </>
  )
}
export default App
