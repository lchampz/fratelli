import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3001',
      '/products': 'http://localhost:3001',
      '/recipes': 'http://localhost:3001',
      '/reports': 'http://localhost:3001',
      '/ifood': 'http://localhost:3001',
    },
  },
}); 