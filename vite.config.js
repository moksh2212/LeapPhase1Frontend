import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 'process.env.BASE_URL': '"http://localhost:3058"',
    'process.env.BASE_URL': '"http://192.168.0.147:8080"',

    'process.env.BASE_URL2': '"http://192.168.0.147:8080"',
  },
  server: {
    host: '0.0.0.0', // Listen on all IP addresses
    port: 3000,      // Specify the port you want to use (e.g., 3000)
  }
})
