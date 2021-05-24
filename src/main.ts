import App from './index.svelte'
import 'webkit/styles/main.css'
import ChartWidget from '@/ChartWidget/index.svelte'
import HDBalanceWidget from '@/HolderDistributionWidget/Balance.svelte'
import { Metric } from '@/metrics'
import { newWidget } from './stores/widgets'
import { newInsightsContextStore } from '@/Sidebar/Insights/context'

const defaultMetrics: Studio.Metric[] = [Metric.price_usd, Metric.dev_activity]
const app = new App({
  target: document.getElementById('app') as Element,
  props: {
    widgets: [
      newWidget(ChartWidget, {
        metrics: defaultMetrics,
        // subwidget: ReactAdapter(Test),
      }),
      newWidget(HDBalanceWidget),
      newWidget(ChartWidget, {
        metrics: [Metric.price_usd],
      }),
      newWidget(ChartWidget, {
        metrics: [Metric.social_volume_total],
      }),
      newWidget(ChartWidget, {
        metrics: [Metric.dev_activity],
      }),
    ],
    InsightsContextStore: newInsightsContextStore(),
  },
})

export default app
