import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend server address for development
        changeOrigin: true, // Change request origin to match backend (helps with CORS)
        secure: false, // Allow HTTP connections during development (not HTTPS)
      },
    },
  },
});
