import { ONE_DAY_IN_MS } from 'webkit/utils/dates'
import { Metric } from '@/metrics'

const WEIGHTED_METRICS = new Set([
  Metric.sentiment_volume_consumed_total.key,
  Metric.sentiment_volume_consumed_telegram.key,
  Metric.sentiment_volume_consumed_reddit.key,
  Metric.sentiment_volume_consumed_twitter.key,
])
const INTERVALS = new Set(['1h', '1d'])

function getWeightedSocialMinInterval(from: Date, to: Date): string {
  const diff = (+to - +from) / ONE_DAY_IN_MS

  if (diff < 33) return '1h'
  return '1d'
}

function setWeightedSocialSettings(
  metricSettings: Studio.MetricSetting,
  { from, to },
) {
  const { interval } = metricSettings
  if (interval && INTERVALS.has(interval) === false) return

  const minInterval = getWeightedSocialMinInterval(new Date(from), new Date(to))
  metricSettings.interval = minInterval
}

export function transformWeightedSocialMetrics(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  studioSettings: any,
) {
  if (WEIGHTED_METRICS.has(metric.key) === false) return

  setWeightedSocialSettings(metricSettings, studioSettings)

  return metricSettings
}
