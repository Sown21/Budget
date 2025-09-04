import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor principal (toujours présent)
          vendor: ['react', 'react-dom'],
          
          // Seulement si vous utilisez ces packages
          router: ['react-router-dom'],
          
          // Supprimez les lignes suivantes si vous ne les utilisez pas :
          // ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          // utils: ['lodash', 'date-fns'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
})