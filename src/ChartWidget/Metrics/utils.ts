import { newAddressMetric, newProjectMetric } from '@/metrics/utils'
import { cacheIndicator } from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'

export function convertBaseProjectMetric(
  metric: Studio.Metric,
  settings: Studio.Project & { address?: string },
) {
  if (metric.project) {
    const { base } = metric
    return metric.indicator ? cacheIndicator(base.base, metric.indicator) : base
  }

  if (metric.indicator) {
    return cacheIndicator(newProjectMetric(settings, metric.base), metric.indicator)
  }

  if (metric.reqMeta?.address) {
    return metric.base
  }

  if (settings.address) {
    return newAddressMetric(settings.address, metric)
  }

  return newProjectMetric(settings, metric)
}
