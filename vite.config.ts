import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './modules/core/'),
      '@lectorium': path.resolve(__dirname, './modules/lectorium/'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
