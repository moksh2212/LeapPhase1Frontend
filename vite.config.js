import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
<<<<<<< HEAD
    'process.env.BASE_URL': '"http://localhost:3058"'
=======

    'process.env.BASE_URL': '"http://192.168.0.141:8080"'

>>>>>>> 72811b7cdc3bff8d53615b5e967a38d23d8c001d
  }
})
