import './App.css'
import { SignupForm } from './features/auth/components/SignupForm.tsx';
import { LoginForm } from './features/auth/components/LoginForm.tsx';
import { ListUsers } from './ListUsers.tsx';
import { ImageUploader } from './features/can-designer/components/ImageUploader.tsx';



function App() {
  const handleUploadComplete = (url: string) => {
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
    </>
  )
}
export default App
