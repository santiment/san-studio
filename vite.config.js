import { defineConfig } from 'vite'
import TsChecker from 'vite-plugin-ts-checker'
import svelte from '@sveltejs/vite-plugin-svelte'

process.env.GQL_SERVER_URL = 'https://api-stage.santiment.net/graphql'
process.env.IS_DEV = process.env.NODE_ENV !== 'production'
process.env.SPRITES_PATH = 'node_modules/san-webkit/lib/sprites'
process.env.ICONS_PATH = 'node_modules/san-webkit/lib/icons'

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
      { find: 'webkit', replacement: '/node_modules/san-webkit/lib/' },
    ],
  },
  define: {
    'process.browser': true,
    'process.env': process.env,
  },
})
