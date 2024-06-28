import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.BASE_URL': '"http://192.168.0.141:8080"'
  }
})
