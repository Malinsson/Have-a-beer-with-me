import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'SYSTEMBOLAGET_VITE_PUBLIC_'],
  server: {
    // Proxy API requests to the Vercel serverless function during development
  }
})
