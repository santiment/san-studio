import App from './index.svelte'
import 'webkit/styles/main.css'
import { newGlobalShortcut } from 'webkit/utils/events'
import { CONTEXT as HISTORY_CONTEXT } from 'webkit/ui/history'
import { Metric } from '@/metrics'
import { newWidget } from '@/stores/widgets'
import { studio } from '@/stores/studio'
import { globals } from '@/stores/globals'
import ChartWidget from '@/ChartWidget/index.svelte'
import { newInsightsContextStore } from '@/Sidebar/Metrics/Insights/context'

// @ts-ignore
window.studio = studio
studio.setProject({ slug: 'ethereum', ticker: 'ETH', name: 'Ethereum' })

const defaultMetrics: Studio.Metric[] = [Metric.price_usd, Metric.dev_activity]
const app = new App({
  target: document.getElementById('app') as Element,
  props: {
    widgets: [
      newWidget(ChartWidget, {
        metrics: defaultMetrics,
      }),
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

export default app
