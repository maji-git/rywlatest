
import path from 'path';
import vue from '@vitejs/plugin-vue';
import fs from 'fs'

import { VitePWA } from 'vite-plugin-pwa'

const packageJSONData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const appVersion = packageJSONData.version
const chunkPrefix = appVersion.replace(/\./g, '')

console.log("Running vite config with chunk prefix ", chunkPrefix)

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www',);
export default async () => {

  return {
    plugins: [
      vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.includes('swiper-') } } }),
      , VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logos/apple-touch-icon.png', 'logos/masked-icon.svg', './rive/logout.riv'],
        manifest: {
          name: 'Rayongwit Latest',
          short_name: 'RYW Latest',
          description: 'ไม่พลาดข่าวระยองวิทยาคม',
          theme_color: '#FFF4CE',
          icons: [
            {
              "src": "public/pwa/manifest-icon-192.maskable.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "public/pwa/manifest-icon-192.maskable.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "maskable"
            },
            {
              "src": "public/pwa/manifest-icon-512.maskable.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "public/pwa/manifest-icon-512.maskable.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ],
          workbox: {
            navigateFallback: '/index.html',
            navigateFallbackAllowlist: [/^(?!\/__)/]
          }
        }
      })
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
        output: {
          entryFileNames: `assets/[name]-${chunkPrefix}.js`,
          chunkFileNames: `assets/[name]-${chunkPrefix}.js`,
          assetFileNames: `assets/[name]=${chunkPrefix}.[ext]`
        }
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
    },
    optimizeDeps: {
      exclude: ['tesseract-wasm']
    },
    define: {
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    }
  };
}
