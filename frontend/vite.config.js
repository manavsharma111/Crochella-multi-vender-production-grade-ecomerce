import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        maximumFileSizeToCacheInBytes: 5000000,
      },
      manifest: {
        name: 'Crochella Premium Store',
        short_name: 'Crochella',
        description: 'Premium handloom products delivered to your door.',
        theme_color: '#ff007f',
        background_color: '#111111',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
