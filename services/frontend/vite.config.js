import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ← IMPORTANT pour Docker
    port: 3000,
    base: '/',
    watch: {
      usePolling: true  // ← Pour le hot reload
    }
  },
})