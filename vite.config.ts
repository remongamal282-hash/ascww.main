import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist'],
          pageflip: ['react-pageflip']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.ascww.org',
        changeOrigin: true,
        secure: true
      }
    }
  }
});

