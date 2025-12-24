
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env is available for the Google GenAI SDK
    'process.env': {
      API_KEY: process.env.API_KEY
    }
  },
  server: {
    port: 3000
  }
});
