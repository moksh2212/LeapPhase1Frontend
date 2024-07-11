import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 'process.env.BASE_URL': '"http://localhost:3058"',
    'process.env.BASE_URL': '"http://localhost:3058"',

    'process.env.BASE_URL2': '"http://192.168.0.128:8080"',
  },
})
