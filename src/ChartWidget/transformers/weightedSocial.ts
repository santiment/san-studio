import { ONE_DAY_IN_MS } from 'webkit/utils/dates'
import { SocialMetric } from '@/metrics/_social'
import { smoothAsCMA } from '../smoothing'

const INTERVALS = new Set(['1h', '1d'])

function getWeightedSocialMinInterval(from: Date, to: Date): string {
  const diff = (+to - +from) / ONE_DAY_IN_MS

  if (diff < 33) return '1h'
  return '1d'
}

function setWeightedSocialInterval(metricSettings: Studio.MetricSetting, { from, to }) {
  const { interval } = metricSettings
  if (interval && INTERVALS.has(interval) === false) return

  const minInterval = getWeightedSocialMinInterval(new Date(from), new Date(to))
  metricSettings.interval = minInterval
}

export function setWeightedSocialSmoothing(key: string, metricSettings) {
  const { smoothing } = metricSettings
  if (!smoothing) {
    delete metricSettings.smoothing
    delete metricSettings.preTransform
    return
  }

  metricSettings.preTransform = (data) => smoothAsCMA(data, smoothing, key)
}

export function transformWeightedSocialMetrics(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  studioSettings: any,
) {
  if (!SocialMetric[metric.key]) return

  setWeightedSocialInterval(metricSettings, studioSettings)
  setWeightedSocialSmoothing(metric.key, metricSettings)

  return metricSettings
}
