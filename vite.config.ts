import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,  // Changed to avoid conflict with main app
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})