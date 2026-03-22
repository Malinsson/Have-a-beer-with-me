import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { EditorPage } from './pages/EditorPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'
import './App.css'



export function App() {
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/edit" element={<EditorPage />}></Route>
          <Route path="/profile/:id" element={<ProfilePage />}></Route>
        </Routes>
      </Layout>
    

    </>
  )
}
