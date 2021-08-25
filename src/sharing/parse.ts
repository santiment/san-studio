import type { Metric as MetricType } from './index'
import { Metric } from '@/metrics'
import { newProjectMetric } from '@/metrics/utils'
import { HolderDistributionMetric } from '@/metrics/_onchain/holderDistributions'
import {
  cacheIndicator,
  Indicator,
} from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'
import {
  MERGED_DIVIDER,
  buildMergedMetric,
} from '@/HolderDistributionWidget/utils'
import { newExpessionMetric } from '@/CombineDialog/utils'

export type KeyToMetric = {
  [metricKey: string]: MetricType
}

export function parse(
  queryString = `?ps=ethereum&pt=ETH&df=2021-02-25T20%3A59%3A59.999Z&dt=2021-08-25T20%3A59%3A59.999Z&emcg=1&wm=ethereum_MC_ETH_MC_price_usd%3Bvolume_usd%3Bmarketcap_usd%3BMA7_marketcap_usd%3BMA50_marketcap_usd%3Bprice_usd&wax=0%3B1%3B2&wc=%235275FF%3B%23D2D6E7%3B%23F47BF7%3B%23FF5B5B%3B%23FFCB47%3B%2326C953&ws=%3B%7B%22interval%22%3A%221d%22%7D%3B%3B%3B%3B&win=%3B%3B%5B%22MA7%22%2C%22MA50%22%5D`,
) {
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

const METRIC_CONNECTOR = '_MC_'
const checkIsProjectMetricKey = (key) => key.includes(METRIC_CONNECTOR)

function getMetric(metricKey: string): MetricType | undefined {
  if (checkIsProjectMetricKey(metricKey)) {
    let [slug, ticker, key] = metricKey.split(METRIC_CONNECTOR)
    return newProjectMetric({ slug, ticker }, Metric[key])
  }

  return Metric[metricKey] || parseMergedMetric(metricKey)
}

function parseMetric(metricKey: string, KnownMetric: KeyToMetric) {
  const metric = KnownMetric[metricKey] || getMetric(metricKey)
  KnownMetric[metricKey] = metric
  return metric
}

export function parseMetrics(
  metricKeys: undefined | string[],
  KnownMetric: KeyToMetric,
) {
  return (metricKeys || [])
    .map((key) => parseMetric(key, KnownMetric))
    .filter(Boolean)
}

export function parseCombinedMetrics(
  metrics: undefined | { k: string; exp: string; l: string; bm: string[] }[],
  KnownMetric: KeyToMetric,
) {
  return (metrics || []).map(({ k, exp, l, bm }) => {
    const metric = newExpessionMetric(bm.map<any>(getMetric), exp, l)
    metric.key = k

    KnownMetric[k] = metric
    return metric
  })
}

function parseMergedMetric(metricKey: string) {
  const mergedMetricKeys = metricKey.split(MERGED_DIVIDER)
  if (mergedMetricKeys.length < 2) return

  return buildMergedMetric(
    mergedMetricKeys.map((key) => HolderDistributionMetric[key]),
  )
}

export function parseIndicators(
  indicators: undefined | string[][],
  metrics: string[],
  KnownMetric: KeyToMetric,
) {
  const MetricIndicators = {}
  const values = indicators || []
  values.forEach((metricIndicators, i) => {
    if (!metricIndicators) return
    const metricKey = metrics[i]
    const metric = getMetric(metricKey)
    if (!metric) return

    const indicatorMetrics = metricIndicators.slice()
    metricIndicators.forEach((indicatorKey, i) => {
      const indicator = Indicator[indicatorKey]
      if (metric) {
        const indicatorMetric = cacheIndicator(metric, indicator)
        KnownMetric[`${indicatorKey}_${metricKey}`] = indicatorMetric
      }
      indicatorMetrics[i] = indicator
      MetricIndicators[metric.key] = new Set(indicatorMetrics)
    })
  })
  return MetricIndicators
}

export function parseMergedMetrics(
  metrics: string[],
  KnownMetric: KeyToMetric,
) {
  const mergedMetrics = [] as any[]
  metrics.forEach((metricKey) => {
    let metric
    try {
      metric = parseMergedMetric(metricKey)
    } catch (e) {
      return
    }

    if (metric) {
      mergedMetrics.push(metric as any)
      KnownMetric[metricKey] = metric
    }
  })
  return mergedMetrics
}

export function parseMetricGraphValue(
  values: undefined | any[],
  metrics: string[],
  KnownMetric: KeyToMetric,
) {
  const result = {}
  ;(values || []).forEach((value, i) => {
    if (!value) return
    const metric = KnownMetric[metrics[i]]
    if (metric) result[metric.key] = value
  })

  return result
}

export function parseAxesMetrics(
  metricIds: undefined | string[],
  metricKeys: string[],
  KnownMetric: KeyToMetric,
) {
  if (!metricKeys) return

  const disabledAxesMetrics = new Set(Object.values(KnownMetric))
  const axesMetrics = new Set()
  ;(metricIds || []).forEach((id) => {
    const metric = KnownMetric[metricKeys[id]]
    if (metric) {
      axesMetrics.add(metric)
      disabledAxesMetrics.delete(metric)
    }
  })
  return { axesMetrics, disabledAxesMetrics }
}
