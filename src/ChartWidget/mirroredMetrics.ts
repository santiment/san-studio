import { Metric } from '@/metrics'
import { FORMATTER } from '@/metrics/formatters'
import { yAxisFormatter } from '@/Chart/Axes/utils'

const axisFormatter = (value: number) => yAxisFormatter(Math.abs(value))
export const MirroredMetric = {
  // [bottom metric key]   :   [top metric]
  [Metric.exchange_outflow.key]: Metric.exchange_inflow,
  [Metric.sentiment_negative_total.key]: Metric.sentiment_positive_total,
  [Metric.sentiment_negative_telegram.key]: Metric.sentiment_positive_telegram,
  [Metric.sentiment_negative_reddit.key]: Metric.sentiment_positive_reddit,
  [Metric.sentiment_negative_twitter.key]: Metric.sentiment_positive_twitter,
}

Object.keys(MirroredMetric).forEach((key) => {
  const bottomMetric = Metric[key]
  const topMetric = MirroredMetric[key]
  const { formatter = FORMATTER } = bottomMetric

  topMetric.axisFormatter = axisFormatter
  bottomMetric.axisFormatter = axisFormatter
  bottomMetric.domainGroup = topMetric.key
  bottomMetric.formatter = (value) => formatter(value && Math.abs(value))
})

const preTransformMirroredMetric = (metricKey: string) => (data: any[]) =>
  data.map((item) => ({
    datetime: item.datetime,
    [metricKey]: -item[metricKey],
  }))
export function transformMirroredMetric(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  metrics: Studio.Metric[],
): Studio.MetricSetting {
  if (metrics.includes(MirroredMetric[metric.key])) {
    metricSettings.preTransform = preTransformMirroredMetric(metric.key)
  } else {
    delete metricSettings.preTransform
  }

  return metricSettings
}
