import { defineConfig } from 'vite';

export default defineConfig({
  base: '/wood-gasifier/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
