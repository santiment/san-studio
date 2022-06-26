import App from './index.svelte'
import 'webkit/styles/main.css'
import { startResponsiveController } from 'webkit/responsive'
import { newGlobalShortcut } from 'webkit/utils/events'
import { CONTEXT as HISTORY_CONTEXT } from 'webkit/ui/history'
import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
import { Metric } from '@/metrics'
import { newWidget } from '@/stores/widgets'
import { studio } from '@/stores/studio'
import { globals } from '@/stores/globals'
import ChartWidget from '@/ChartWidget/index.svelte'
import { newInsightsContextStore } from '@/Sidebar/Metrics/Insights/context'
import { showMasterSelectorDialog } from './MasterSelectorDialog'

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
  props: {
    widgets: [
      newWidget(ChartWidget, { metrics: defaultMetrics }),
      // newWidget(ChartWidget, { metrics: [Metric.social_dominance_total] }),
      // newWidget(ChartWidget, { metrics: [Metric.dev_activity] }),
    ],
    InsightsContextStore: newInsightsContextStore(),
  },
})

// @ts-ignore
window.toggleNight = () =>
  globals.toggle('isNightMode', document.body.classList.toggle('night-mode'))

const History = app.$$.context.get(HISTORY_CONTEXT)
newGlobalShortcut('CMD+Z', History.undo)
newGlobalShortcut('CMD+SHIFT+Z', History.redo)
newGlobalShortcut('CMD+K', showMasterSelectorDialog)

new FeatureWalkthrough({ target: document.body })

export default app
