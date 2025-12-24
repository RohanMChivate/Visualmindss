import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Bridges environment variables correctly to the browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
});