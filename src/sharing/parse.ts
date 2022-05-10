import type { Metric as BaseMetricType } from './index'
import { MetricType, newProjectMetric } from '@/metrics/utils'
import { newExpessionMetric } from '@/CombineDialog/utils'
import { parseMetric, parseMetricKey } from './metrics'

export type KeyToMetric = {
  [metricKey: string]: BaseMetricType
}

export function parse(queryString: string) {
  const qs = queryString.startsWith('?') ? queryString.slice(1) : queryString
  const entries = qs.split('&')

  const result = {}
  for (let i = 0, len = entries.length; i < len; i++) {
    const [key, value] = decodeURIComponent(entries[i]).split('=')
    result[key] = value
  }
  return result
}

export const parseArray = (value?: string) => value?.split(';') || []

export function parseMetrics(metricKeys: undefined | string[], KnownMetric: KeyToMetric) {
  return (metricKeys || [])
    .map((key) => {
      const metric = KnownMetric[key] || parseMetric(key)
      return (KnownMetric[key] = metric)
    })
    .filter(Boolean)
}

export function parseCombinedMetrics(
  metrics: undefined | { k: string; exp: string; l: string; bm: string[] }[],
  KnownMetric: KeyToMetric,
): any[] {
  return (metrics || []).map(({ k, exp, l, bm }) => {
    const metric = newExpessionMetric(bm.map<any>(parseMetric), exp, l) as any

    const [_, key, slug, ticker] = (parseMetricKey(k) || []) as any
    metric.key = (key || k) as any

    KnownMetric[k] = slug ? newProjectMetric({ slug, ticker }, metric) : metric
    return metric
  })
}

export function parseIndicators(metrics: any[]): { [metricKey: string]: Set<string> } {
  const MetricIndicators = {}
  metrics.forEach(({ indicator, base }) => {
    if (!indicator) return

    if (!MetricIndicators[base.key]) {
      MetricIndicators[base.key] = new Set()
    }

    MetricIndicators[base.key].add(indicator.key)
  })
  return MetricIndicators
}

export function parseMergedMetrics(metrics: any[]) {
  return metrics.filter((metric) => metric.__type === MetricType.MergedSupplyDistribution)
}

export function parseMetricGraphValue(values: undefined | any[], metrics: any[]) {
  const result = {}
  ;(values || []).forEach((value, i) => {
    if (!value) return
    const metric = metrics[i]
    if (metric) result[metric.key] = value
  })
  return result
}

export function parseAxesMetrics(metricIds: undefined | string[], metrics: any[]) {
  if (!metrics) return

  const disabledAxesMetrics = new Set(metrics)
  const axesMetrics = new Set<Studio.Metric>()
  ;(metricIds || []).forEach((id) => {
    const metric = metrics[id]
    if (metric) {
      axesMetrics.add(metric)
      disabledAxesMetrics.delete(metric)
    }
  })
  return { axesMetrics, disabledAxesMetrics }
}
