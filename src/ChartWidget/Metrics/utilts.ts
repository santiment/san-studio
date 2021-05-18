import { newProjectMetric } from '@/metrics/utils'
import { cacheIndicator } from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'

export function convertBaseProjectMetric(metric: Studio.Metric, project) {
  if (metric.project) {
    const { base } = metric
    return metric.indicator ? cacheIndicator(base.base, metric.indicator) : base
  }

  if (metric.indicator) {
    return cacheIndicator(
      newProjectMetric(project, metric.base),
      metric.indicator,
    )
  }

  return newProjectMetric(project, metric)
}
