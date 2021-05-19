import { MetricCategory } from './graph'
import { each } from './utils'

export const DevelopmentMetric = each(
  {
    dev_activity: {
      label: 'Development Activity',
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Development
  },
)
