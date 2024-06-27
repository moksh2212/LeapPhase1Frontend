import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
<<<<<<< HEAD
    'process.env.BASE_URL': '"http://192.168.0.141:8080"'
=======
    'process.env.BASE_URL': '"http://localhost:3058"'
>>>>>>> 3d9b6a6a1e827621a70280f8bc0fd65fb11935c5
  }
})
