import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Tauri dev server needs to listen on all interfaces and use a specific port
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    watch: {
      // Prevent Vite from triggering full reload on Rust file changes
      ignored: ['**/src-tauri/**'],
    },
  },

  // Base path configurable for future GitHub Pages deployment (e.g. /Med-Learn/)
  // Defaults to '/' for local development and local Tauri bundle
  base: process.env.VITE_BASE_PATH || process.env.BASE_PATH || '/',

  build: {
    // Tauri requires ES2021+ target for modern APIs
    target: ['es2021', 'chrome100', 'safari13'],
    // Reduce sourcemap size in development
    sourcemap: false,
    // Keep chunk size manageable
    chunkSizeWarningLimit: 1000,
  },

  // Silence CSS @import warnings from Google Fonts (network import)
  css: {
    devSourcemap: true,
  },
}))
