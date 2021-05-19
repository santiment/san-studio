import { prepareDomain } from 'san-chart/bars/greenRedBars'
import { Metric } from '@/metrics'
import { Node } from '@/Chart/nodes'

const DEFAULT_DOMAIN_METRIC = new Set([
  Metric.twitter_followers.key,
  // Metric.miners_balance.key,
])

export function newDomainModifier(
  metrics: Studio.Metric[],
  MetricSettings: Studio.MetricSetting,
) {
  const MetricNode = {}
  metrics.forEach(({ key, node }) => {
    MetricNode[key] = MetricSettings[key]?.node || node
  })

  return (metricKey: string, minMax) => {
    if (DEFAULT_DOMAIN_METRIC.has(metricKey)) return
    const node = MetricNode[metricKey]
    let { min, max } = minMax

    if (node === Node.GREEN_RED_BAR) {
      return prepareDomain(minMax)
    } else if (node === Node.BAR) {
      max *= 1.01
      min = min < 0 ? min : 0
    } else {
      max *= 1.01
      min *= min > 0 ? 0.99 : 1.01
    }

    minMax.max = max
    minMax.min = min
  }
}
