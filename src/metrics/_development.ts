import { MetricCategory } from './graph'
import { each } from './utils'

export const DevelopmentMetric = each(
  {
    dev_activity: {
      label: 'Development Activity',
      reqMeta: {
        transform: {
          type: 'moving_average',
          movingAverageBase: 7,
        },
      },
    },
  },
  (metric: Studio.Metric) => {
    metric.category = MetricCategory.Development
  },
)
