import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.BASE_URL': '"http://192.168.0.147:8080"',
    'process.env.BASE_URL2': '"http://192.168.0.147:8080"',
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
