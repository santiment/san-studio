import { Node } from '@/Chart/nodes'
import { deriveMetric } from '@/metrics/utils'

const RAW_INDICATORS = {
  MA: {
    type: 'moving_average',
    bases: [7, 30, 50, 200],
  },
}

export const Indicator = {}
Object.keys(RAW_INDICATORS).forEach((key) => {
  const { type, bases } = RAW_INDICATORS[key]

  bases.forEach((base) => {
    const indicatorKey = key + base
    Indicator[indicatorKey] = {
      base,
      type,
      key: indicatorKey,
      label: `${key}(${base})`,
    }
  })
})

export const INDICATORS = Object.values(Indicator)

const IndicatorMetricCache = {}
function getMetricCache({ key }) {
  let cache = IndicatorMetricCache[key]
  if (!cache) {
    cache = {}
    IndicatorMetricCache[key] = cache
  }
  return cache
}

export function cacheIndicator(metric, indicator) {
  const metricStore = getMetricCache(metric)
  const indicatorMetric = buildIndicatorMetric(metric, indicator)
  metricStore[indicator.key] = indicatorMetric
  return indicatorMetric
}

function removeCachedIndicator(metric, indicator) {
  const metricStore = getMetricCache(metric)
  const indicatorMetric = metricStore[indicator.key]

  delete metricStore[indicator.key]
  return indicatorMetric
}

export function buildIndicatorMetric(metric, indicator) {
  const cached = getMetricCache(metric)[indicator.key]
  if (cached) return cached

  const { key, label, base, noProject } = metric
  const indicatorMetric = deriveMetric(metric, {
    indicator,
    base: metric,
    node: Node.LINE,
    key: `${indicator.key}_${key}`,
    label: `${label} ${indicator.label}`,
    getLabel: base || noProject ? undefined : (ticker) => `${label} (${ticker}) ${indicator.label}`,
    // TODO: Think how to better handle current project labeling  [@vanguard | May 14, 2021]
    reqMeta: {
      transform: {
        type: indicator.type,
        movingAverageBase: indicator.base,
      },
    },
  } as any)

  return indicatorMetric
}
