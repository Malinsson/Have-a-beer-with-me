import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

import { Layout } from './shared/components/Layout.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const HomePage = lazy(() => import('./pages/HomePage.jsx').then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage })))
const AuthPage = lazy(() => import('./pages/AuthPage.jsx').then((m) => ({ default: m.AuthPage })))
const IntroPage = lazy(() => import('./pages/IntroPage.jsx').then((m) => ({ default: m.IntroPage })))
const DesignerPage = lazy(() => import('./pages/DesignerPage.jsx').then((m) => ({ default: m.DesignerPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage })))
const BeerShelfPage = lazy(() => import('./pages/BeerShelfPage.jsx').then((m) => ({ default: m.BeerShelfPage })))
const CanDetailPage = lazy(() => import('./pages/CanDetailPage.jsx').then((m) => ({ default: m.CanDetailPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx').then((m) => ({ default: m.NotFoundPage })))


export function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<p className="text-center mt-10">Laddar...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route path="/intro" element={<IntroPage />}></Route>
          <Route path="/design" element={<DesignerPage />}></Route>
          <Route path="/profile/:slug" element={<ProfilePage />}></Route>
          <Route path="/profile/:slug/hylla" element={<BeerShelfPage />}></Route>
          <Route path="/can/:shareId" element={<CanDetailPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
