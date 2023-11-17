import 'webkit/styles/main.css'
import App from '@/EmbeddableChartWidget/WithApi.svelte'
import { studio } from '@/stores/studio'
import { globals } from '@/stores/globals'
import { newWidget } from '@/stores/widgets'
import { parseQueryString } from '@/ChartWidget/Controls/Embed/utils'
import { AssetMessage, ThemeMessage } from './utils'

const {
  from,
  to,
  slug,
  ticker,
  isNightMode,
  isWithMetricSettings,
  isMinimapEmbedded,
  isCalendarEnabled,
  ...widgetProps
} = parseQueryString(
  window.location.search ||
    `?ps=ethereum&pt=ETH&df=2021-02-25T20%3A59%3A59.999Z&dt=2021-08-25T20%3A59%3A59.999Z&emcg=1&wm=ethereum_MC_ETH_MC_price_usd%3BMA7_price_usd%3BMA50_price_usd%3BMA30_ethereum_MC_ETH_MC_price_usd&wax=0%3B1&wc=%23FFCB47%3B%23F47BF7%3B%23FF5B5B%3B%235275FF&ws=%3B%3B%3B&win=%5B%22price_usd%22%2C%5B%22MA7%22%2C%22MA50%22%5D%5D%3B%5B0%2C%5B%22MA30%22%5D%5D`,
) as any

studio.setProject({ from, to, slug, ticker })

globals.toggle('isNightMode', isNightMode)
document.body.classList.toggle('night-mode', isNightMode)

AssetMessage.listen((asset) => {
  studio.setProject(asset)
})

ThemeMessage.listen((theme) => {
  globals.toggle('isNightMode', theme.dark)
  document.body.classList.toggle('night-mode', theme.dark)
})

const app = new App({
  target: document.querySelector('body') as Element,
  props: {
    isWithMetricSettings,
    isMinimapEmbedded,
    isCalendarEnabled,
    widget: newWidget(null, widgetProps),
  },

  context: new Map([
    ['STUDIO', new Map()],
    ['APP_TOOLTIPS_CTX', new Map()],
  ]),
})

export default app
