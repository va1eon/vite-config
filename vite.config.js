import {defineConfig} from 'vite'
import injectHTML from 'vite-plugin-html-inject'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import viteCompression from 'vite-plugin-compression'
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer'
import terser from '@rollup/plugin-terser'
import Font from 'vite-plugin-font'
import {optimizeImages} from './custom_plugins/imageOptimizer.js'
import {wrapImgWithPicture} from './custom_plugins/wrapImgWithPicture.js'
import {DEFAULT_OPTIONS} from './custom_plugins/imageOptimizerConfig.js'
import {ttfToWoff2} from './custom_plugins/ttfToWoff2.js'
import viteLegacyPlugin from '@vitejs/plugin-legacy'


export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
    }),
    injectHTML({
      tagName: 'include',
    }),
    terser(),
    cssnano({
      preset: 'default',
    }),
    Font.vite(),
    ViteImageOptimizer(DEFAULT_OPTIONS),
    {
      name: 'optimize-images',
      closeBundle: async () => {
        process.env.NODE_ENV === 'dev' ? await optimizeImages() : await function () {}
      },
    },
    {
      name: 'wrap-images-with-picture',
      closeBundle: async () => {
        await wrapImgWithPicture()
      },
    },
    {
      name: 'ttf-to-woff2',
      closeBundle: async () => {
        await ttfToWoff2()
      },
    },
    viteLegacyPlugin({
      targets: ['defaults', 'not IE 11'],
    })
  ],

  css: {
    postcss: {
      plugins: [autoprefixer({})]
    },
    preprocessorOptions: {
      scss: {
        api: 'modern',
        quietDeps: true,
        silenceDeprecation: 'import',
      }
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
  },

  base: './',

  server: {
    port: 3000,
    open: true,
  },
})

