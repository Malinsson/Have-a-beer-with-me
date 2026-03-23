import { Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import { Layout } from './components/Layout.tsx' // Importing header and footer
import { HomePage } from './pages/HomePage.tsx'
import { AuthPage } from './pages/AuthPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { DesignerPage } from './pages/DesignerPage.tsx'
import { BeerShelfPage } from './pages/BeerShelfPage.tsx'
import { CanDetailPage } from './pages/CanDetailPage.tsx'




export function App() {
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/design" element={<DesignerPage />}></Route>
          <Route path="/profile/:id" element={<ProfilePage />}></Route>
          <Route path="/profile/:id/hylla" element={<BeerShelfPage />}></Route>
          <Route path="/detail" element={<CanDetailPage />}></Route>
        </Routes>
      </Layout>
    

    </>
  )
}
