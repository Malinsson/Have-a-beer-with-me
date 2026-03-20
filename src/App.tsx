import CanPreview3D from './features/can-designer/components/CanPreview3D.tsx'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import './App.css'



export function App() {

  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/edit" element={<EditorPage />}></Route>
      <Route path="/profile/:id" element={<ProfilePage />}></Route>
    </Routes>
  </Layout>
  

  return (
    <>
      <CanPreview3D />
    </>
  )
}
