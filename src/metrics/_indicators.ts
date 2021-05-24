import { MetricCategory } from './graph'
import { ratioPercentForamtter, ratioPercentAxisFormatter } from './formatters'
import { each } from './utils'
import { Node } from '@/Chart/nodes'

export const IndicatorsMetric = each(
  {
    price_daa_divergence: {
      category: 'Indicators',
      label: 'Price DAA Divergence',
      node: Node.GREEN_RED_BAR,
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    adjusted_price_daa_divergence: {
      category: 'Indicators',
      label: 'Adjusted Price DAA Divergence',
      node: Node.GREEN_RED_BAR,
      formatter: ratioPercentForamtter,
      axisFormatter: ratioPercentAxisFormatter,
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Indicators
  },
)
