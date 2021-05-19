import { parseIntervalString } from 'webkit/utils/dates'
import { Metric } from '@/metrics'
import { MirroredMetric, transformMirroredMetric } from './mirroredMetrics'

const IntervalFormatDividend = {
  h: 24,
  m: 60 * 24,
}
export function calculateMovingAverageFromInterval(interval) {
  const { amount, format } = parseIntervalString(interval)
  const dividend = IntervalFormatDividend[format] || 1
  return (dividend / amount) * 7
}

function transformDevActivity(
  metricSettings: Studio.MetricSetting,
  { interval },
): Studio.MetricSetting {
  metricSettings.transform = {
    type: 'moving_average',
    movingAverageBase: calculateMovingAverageFromInterval(interval),
  }
  return metricSettings
}

export function transformMetricSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  metrics: Studio.Metric[],
  studioSettings,
): Studio.MetricSetting {
  const { key } = metric.base || metric

  if (key === Metric.dev_activity.key)
    return transformDevActivity(metricSettings, studioSettings)

  if (MirroredMetric[metric.key])
    return transformMirroredMetric(metric, metricSettings, metrics)

  return metricSettings
}

export function newMetricSettingsTransformer(settings) {
  return (
    metric: Studio.Metric,
    metricSettings: Studio.MetricSetting,
    metrics: Studio.Metric[],
  ) => transformMetricSettings(metric, metricSettings, metrics, settings)
}
