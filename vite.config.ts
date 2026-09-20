import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  /*
   * Local development:
   *   http://localhost:5173/
   *
   * GitHub Pages production build:
   *   https://<username>.github.io/JanSahay/
   */
  base: command === 'build' ? '/JanSahay/' : '/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));