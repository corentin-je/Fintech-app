import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const target = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/auth': { target, changeOrigin: true },
      '/home': { target, changeOrigin: true },
      '/health': { target, changeOrigin: true },
      '/api': {
        target,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
