// Configuration for your app
import { configure } from 'quasar/wrappers'         // ✅ correct
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'

export default configure((ctx) => {
  return {
    boot: ['i18n', 'axios'],
    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      typescript: {
        strict: true,
        vueShim: true
      },
      vueRouterMode: 'hash',

      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.modeName === 'ssr',
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))]
          }
        ],
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true
            }
          },
          { server: false }
        ]
      ],

      vite: {
        resolve: {
          alias: {
            '@': resolve(__dirname, './src'),
            components: resolve(__dirname, './src/components'),
            pages: resolve(__dirname, './src/pages'),
            layouts: resolve(__dirname, './src/layouts'),
          }
        }
      }
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: []
    },

    animations: [],

    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false
    },

    pwa: {
      workboxMode: 'GenerateSW'
    },

    cordova: {},
    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      builder: {
        appId: 'client'
      }
    },

    bex: {
      extraScripts: []
    }
  }
})
// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file