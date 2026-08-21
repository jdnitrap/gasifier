import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/wood-gasifier/',  // Match your GitHub repo name
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
