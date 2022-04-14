import type { CachePolicy } from 'webkit/api/cache'
import { dataAccessor } from '@/api/timeseries'
import { queryMetric } from '@/api/timeseries/queries'
import { percentFormatter, axisPercentFormatter } from '@/metrics/formatters'
import { MetricType, newKey } from '@/metrics/utils'
import { getType } from '@/metrics/_onchain/holderDistributions'

export const MERGED_DIVIDER = '__MM__'
const MergedTypePropsTuple = [
  [' coins'], // 0 === false
  [' coins %', percentFormatter, axisPercentFormatter], // 1 === true
]

const immutate =
  (key) =>
  ({ datetime }) => ({ datetime, [key]: 0 })
const keyGetter = ({ key }) => key

export const checkIfWasNotMerged = (newKey: string, mergedMetrics: any[]): boolean =>
  !mergedMetrics.some(({ key }) => key === newKey)

function mergeMetricLabels(startLabel: string, endLabel: string): string {
  const endRightBoundaryIndex = endLabel.lastIndexOf('-')
  return (
    startLabel.slice(0, startLabel.indexOf('-') + 2) +
    endLabel.slice(endRightBoundaryIndex + 2, endLabel.indexOf(')', endRightBoundaryIndex) + 1)
  )
}

function reduceMetricsLabels(baseMetrics: any[]): string {
  let label = ''
  let start = baseMetrics[0]
  let end = start

  function addLabel(newLabel: string) {
    if (label) label += ', '
    label += newLabel
  }

  for (let i = 1, len = baseMetrics.length; i < len; i++) {
    const metric = baseMetrics[i]

    if (metric.__i - end.__i === 1) {
      end = metric
      continue
    }

    addLabel(mergeMetricLabels(start.label, end.label))
    start = metric
    end = metric
  }

  if (start !== end) {
    addLabel(mergeMetricLabels(start.label, end.label))
  } else {
    addLabel(end.label.slice(0, end.label.indexOf(')') + 1))
  }

  return label
}

function newMergedKey(baseMetrics: any[]) {
  const base = getType(baseMetrics[0].key)
  const map = ({ key }) => key.replace(base + '_', '')

  return newKey(MetricType.MergedSupplyDistribution, base, ...baseMetrics.map(map))
}

const mergedMetricsSorter = (a, b) => a.__i - b.__i
export function buildMergedMetric(baseMetrics: any[]) {
  baseMetrics.sort(mergedMetricsSorter)

  const isPercentMerge = baseMetrics[0].type === 'percent'
  const [labelPostfix, formatter, axisFormatter] = MergedTypePropsTuple[+isPercentMerge]

  const metric = {
    fetch,
    baseMetrics,
    formatter,
    axisFormatter,
    node: 'line',
    key: newMergedKey(baseMetrics),
    label: reduceMetricsLabels(baseMetrics) + labelPostfix,
    __type: MetricType.MergedSupplyDistribution,
  }

  return metric
}

function fetch(variables, metric: Studio.HolderDistributionMetric, cachePolicy?: CachePolicy) {
  const { key, baseMetrics, type } = metric
  const isPercentMerge = type === 'percent'

  const baseKeys = baseMetrics.map(keyGetter)
  const queries = baseMetrics.map(({ key, queryKey = key }) =>
    queryMetric(
      {
        ...variables,
        key,
        metric: queryKey,
      },
      undefined,
      cachePolicy,
    ).then(dataAccessor),
  )

  return Promise.all(queries).then((allData) => {
    const result = allData[0].map(immutate(key))

    const baseLength = allData.length
    for (let i = 0; i < baseLength; i++) {
      const data = allData[i]
      const baseKey = baseKeys[i]

      const { length } = data
      for (let y = 0; y < length; y++) {
        result[y][key] += data[y][baseKey]
      }
    }

    if (isPercentMerge) {
      const { length } = result
      for (let i = 0; i < length; i++) {
        result[i][key] /= baseLength
      }
    }

    return result
  })
}
