import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './',
  root: path.resolve(__dirname, 'src/renderer'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    watch: {
      include: 'src/**'
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  }
}) 