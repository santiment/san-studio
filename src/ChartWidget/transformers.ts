import { parseIntervalString } from 'webkit/utils/dates'
import { Metric } from '@/metrics'

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
  metricSettings: Studio.MetricSetting,
  metric: Studio.Metric,
  studioSettings,
): Studio.MetricSetting {
  const { key } = metric.base || metric
  switch (key) {
    case Metric.dev_activity.key:
      return transformDevActivity(metricSettings, studioSettings)
  }

  return metricSettings
}

export function newMetricSettingsTransformer(settings) {
  return (metric: Studio.Metric, MetricSettings) =>
    transformMetricSettings(metric, MetricSettings, settings)
}
