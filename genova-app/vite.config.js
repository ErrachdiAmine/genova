import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Use the latest JavaScript features
    sourcemap: false, // Enable source maps
  },
  define: {
    'import.meta.env.PROD': mode === 'production',
    'import.meta.env.VERCEL': JSON.stringify(process.env.VERCEL || false)
  },
  server: {
    port: 5173,
  }
})
