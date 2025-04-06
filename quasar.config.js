import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import checker from 'vite-plugin-checker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function (ctx) {
  return {
    supportTS: false,

    boot: [
      'i18n',
      'axios',
      'auth-dialog'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'fontawesome-v6',
      'roboto-font',
      'material-icons',
    ],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'history',
      vitePlugins: [
        [
          vueI18n,
          {
            ssr: ctx.mode.ssr,
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))]
          }
        ],
        [
          checker,
          {
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
              useFlatConfig: true
            }
          },
          {
            server: false
          }
        ]
      ]
    },

    devServer: {
      https: false,
      port: 9000,
      open: true
    },

    framework: {
      lang: 'fa',
      config: {
        rtl: true,
      },
      plugins: ['Notify', 'Dialog']
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
      packager: {},
      builder: {
        appId: 'event-management'
      }
    },

    bex: {
      extraScripts: []
    }
  }
};
