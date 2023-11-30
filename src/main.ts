import App from './index.svelte'
import 'webkit/styles/main.css'
import { startResponsiveController } from 'webkit/responsive'
import { newGlobalShortcut } from 'webkit/utils/events'
import { CONTEXT as HISTORY_CONTEXT } from 'webkit/ui/history'
import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
import { Metric } from '@/metrics'
import { newWidget } from '@/stores/widgets'
import { studio } from '@/stores/studio'
import { globals } from '@/stores/globals'
import ChartWidget from '@/ChartWidget/index.svelte'
import { newInsightsContextStore } from '@/Sidebar/Metrics/Insights/context'
import { showMasterSelectorDialog } from './MasterSelectorDialog'
import { CTX } from './context'

startResponsiveController()

window.__onLinkClick = (e) => {
  e.preventDefault()
  console.log('link clicked ->', e.currentTarget)
}

// @ts-ignore
window.studio = studio
studio.setProject({ slug: 'bitcoin', ticker: 'BTC', name: 'Bitcoin' })

const defaultMetrics: Studio.Metric[] = [
  Metric.price_usd,
  // Metric.social_volume_total
]
const app = new App({
  target: document.getElementById('app') as Element,
  context: new Map([[CTX, new Map()]]),
  props: {
    title: 'XRP Social Dominance',
    description:
      'Track the on-chain activity on 18 decentralized exchanges, their daily volumes, number of trades and the usage rate of individual DEXes over time. This data is from the main decentralized exchanges namely Balancer, Bancor, Curve, dYdX, Etherdelta, Gnosis, IDEX, Kyber, Oasis, 0x, Tokenstore, Uniswap, AirSwap, DEX.Top and DDEX.',
    widgets: [
      newWidget(ChartWidget, { metrics: defaultMetrics }),
      // newWidget(ChartWidget, { metrics: [Metric.social_dominance_total] }),
      // newWidget(ChartWidget, { metrics: [Metric.dev_activity] }),
    ],
    InsightsContextStore: newInsightsContextStore(),
  },
})
const ROOT_CTX = app.$$.context

// @ts-ignore
window.toggleNight = () =>
  globals.toggle('isNightMode', document.body.classList.toggle('night-mode'))

const History = ROOT_CTX.get(HISTORY_CONTEXT)
newGlobalShortcut('CMD+Z', History.undo)
newGlobalShortcut('CMD+SHIFT+Z', History.redo)
newGlobalShortcut('CMD+K', showMasterSelectorDialog)
ROOT_CTX.get(CTX).set(HISTORY_CONTEXT, History)

new FeatureWalkthrough({ target: document.body, context: ROOT_CTX })
new Dialogs({ target: document.body, context: ROOT_CTX })

export default app
