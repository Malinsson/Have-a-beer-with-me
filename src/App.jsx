import { Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { IntroPage } from './pages/IntroPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { DesignerPage } from './pages/DesignerPage.jsx'
import { BeerShelfPage } from './pages/BeerShelfPage.jsx'
import { CanDetailPage } from './pages/CanDetailPage.jsx'


export function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/intro" element={<IntroPage />}></Route>
          <Route path="/design" element={<DesignerPage />}></Route>
          <Route path="/profile/:id" element={<ProfilePage />}></Route>
          <Route path="/profile/:id/hylla" element={<BeerShelfPage />}></Route>
          <Route path="/can/:designId" element={<CanDetailPage />} />
        </Routes>
      </Layout>
    </>
  )
}
