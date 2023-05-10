import { resolve } from 'path'
import { defineConfig } from 'vite'
import TsChecker from 'vite-plugin-ts-checker'
import { svelte } from '@sveltejs/vite-plugin-svelte'

process.env.GQL_SERVER_URL = 'https://api-stage.santiment.net/graphql'
process.env.IS_DEV_MODE = process.env.NODE_ENV !== 'production'
process.env.MEDIA_PATH = '/node_modules/san-webkit/lib'
process.env.ICONS_PATH = '/node_modules/san-webkit/lib/icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TsChecker(), svelte()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },

      {
        find: 'san-chart',
        replacement: '/node_modules/@santiment-network/chart/',
      },
      { find: 'webkit', replacement: __dirname + '/node_modules/san-webkit/lib/' },
      { find: 'san-webkit', replacement: __dirname + '/node_modules/san-webkit/' },
      { find: 'air-datepicker', replacement: __dirname + '/node_modules/air-datepicker/' },
    ],
  },
  define: {
    'process.browser': true,
    'process.env': process.env,
    'process.env.IS_DEV_MODE': process.env.IS_DEV_MODE,
  },
  optimizeDeps: {
    exclude: ['webkit', 'san-webkit', 'canvas', 'node-fetch'],
  },

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        chart: resolve(__dirname, 'chart/index.html'),
      },
    },
  },
})
