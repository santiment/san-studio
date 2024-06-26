import { cacheIndicator, Indicator } from '@/ChartWidget/MetricSettings/IndicatorSetting/utils'
import { buildMergedMetric } from '@/HolderDistributionWidget/utils'
import { Metric, MetricAliases } from '@/metrics'
import { MetricType, newAddressMetric, newProjectMetric } from '@/metrics/utils'
import { HolderDistributionMetric } from '@/metrics/_onchain/holderDistributions'
import { createDynamicLabelFqnMetric, LABEL_ASSET_SLUG } from '@/metrics/_onchain_labels/labelFqn'

export function shareMetrics(metrics: Studio.Metric[]): string[] {
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

function parseAddressLockedMetric([_, metricKey, address]) {
  const metric = Metric[metricKey]
  return metric && newAddressMetric(address, metric)
}

export function parseMetric(key: string | TupleData[]): any | undefined {
  let data = key
  if (typeof key === 'string') {
    if (key[0] !== '[') {
      if (key.includes(LABEL_ASSET_SLUG)) {
        return createDynamicLabelFqnMetric(LABEL_ASSET_SLUG, key)
      }

      return Metric[key] || MetricAliases[key]
    }

    data = parseMetricKey(key)
  }

  switch (+data[0]) {
    case MetricType.ProjectLocked:
      return parseProjectLockedMetric(data as any)
    case MetricType.Indicator:
      return parseIndicatorMetric(data as any)
    case MetricType.MergedSupplyDistribution:
      return parseMergedSupplyDistributionMetric(data as any)
    case MetricType.AddressLocked:
      return parseAddressLockedMetric(data as any)
  }
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

export function getMetricKeyData(key: string) {
  if (key[0] !== '[') {
    return [MetricType.Basic, key]
  }

  return parseMetricKey(key)
}

// parseTuple('[2;[1;price_usd;bitcoin;BTC];MA30]')
