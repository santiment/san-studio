import { cacheIndicator, Indicator } from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'
import { buildMergedMetric } from '@/HolderDistributionWidget/utils'
import { Metric } from '@/metrics'
import { newKey, MetricType, newProjectMetric } from '@/metrics/utils'
import { HolderDistributionMetric } from '@/metrics/_onchain/holderDistributions'

export function shareMetrics(metrics: Studio.Metric[]): string[] {
  console.log(metrics.map(({ key }) => key))
  return metrics.map(({ key }) => key)
}

function parseProjectLockedMetric([_, metricKey, slug, ticker]: [string, string, string, string]) {
  const metric = parseMetric(metricKey)
  return metric && newProjectMetric({ slug, ticker }, metric)
}

function parseIndicatorMetric([_, metricKey, indicatorKey]: [string, string, string]) {
  const indicator = Indicator[indicatorKey]
  if (!indicator) return

  const metric = parseMetric(metricKey)
  return metric && cacheIndicator(metric, indicator)
}

function parseMergedSupplyDistributionMetric([_, base, ...mergedKeys]) {
  let isMissing = false
  const baseMetrics = mergedKeys.map((key) => {
    const metric = HolderDistributionMetric[base + '_' + key]
    if (!metric) isMissing = true
    return metric
  })

  if (isMissing) return
  return buildMergedMetric(baseMetrics)
}

export function parseMetric(key: string | TupleData[]): any | undefined {
  let data = key
  if (typeof key === 'string') {
    if (key[0] !== '[') {
      return Metric[key]
    }

    data = parseMetricKey(key)
  }

  switch (+data[0]) {
    case MetricType.ProjectLocked:
      return parseProjectLockedMetric(data)
    case MetricType.Indicator:
      return parseIndicatorMetric(data)
    case MetricType.MergedSupplyDistribution:
      return parseMergedSupplyDistributionMetric(data)
  }
}

export function parseMetrics(metrics: any[]) {
  console.log(metrics)
}

type TupleData = string | string[]
export function parseMetricKey(key: string): TupleData[] {
  return getTupleData(key.slice(1, -1).split(';'))
}

export function getTupleData(args: string[], cursor = { i: 0 }): TupleData[] {
  const data: TupleData[] = []

  for (; cursor.i < args.length; cursor.i++) {
    const arg = args[cursor.i]

    if (arg.endsWith(']')) {
      data.push(arg.slice(0, -1))
      return data
    }

    if (arg.startsWith('[')) {
      cursor.i++
      data.push([arg.slice(1), ...(getTupleData(args, cursor) as TupleData)])
      continue
    }

    data.push(arg)
  }

  return data
}

// parseTuple('[2;[1;price_usd;bitcoin;BTC];MA30]')
