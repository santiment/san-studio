import App from './index.svelte'
import 'webkit/styles/main.css'
import ChartWidget from '@/ChartWidget/index.svelte'
import { Metric } from '@/metrics'
import { newWidget } from './stores/widgets'

const defaultMetrics: Studio.Metric[] = [
  Metric.price_usd,
  Metric.exchange_inflow,
  Metric.exchange_outflow,
]
const app = new App({
  target: document.getElementById('app') as Element,
  props: {
    widgets: [
      newWidget(ChartWidget, {
        metrics: defaultMetrics,
        // subwidget: ReactAdapter(Test),
      }),
    ],
  },
})

export default app
