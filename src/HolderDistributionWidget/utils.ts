import type { CachePolicy } from 'webkit/api/cache'
import { dataAccessor } from '@/api/timeseries'
import { queryMetric } from '@/api/timeseries/queries'
import { percentFormatter, axisPercentFormatter } from '@/metrics/formatters'

export const MERGED_DIVIDER = '__MM__'
const MergedTypePropsTuple = [
  [' coins'], // 0 === false
  [' coins %', percentFormatter, axisPercentFormatter], // 1 === true
]

const LABEL_PERCENT_POSTFIX = ' %'
const removeLabelPostfix = (str: string) =>
  str.replace(LABEL_PERCENT_POSTFIX, '')

const immutate =
  (key) =>
  ({ datetime }) => ({ datetime, [key]: 0 })
const keyGetter = ({ key }) => key
const labelGetter = ({ label }) =>
  removeLabelPostfix(label.replace(' coins', ''))

export const checkIfWasNotMerged = (
  newKey: string,
  mergedMetrics: any[],
): boolean => !mergedMetrics.some(({ key }) => key === newKey)

export function buildMergedMetric(baseMetrics) {
  const isPercentMerge = baseMetrics[0].type === 'percent'
  const [labelPostfix, formatter, axisFormatter] =
    MergedTypePropsTuple[+isPercentMerge]

  const metric = {
    fetch,
    baseMetrics,
    formatter,
    axisFormatter,
    node: 'line',
    key: baseMetrics.map(keyGetter).sort().join(MERGED_DIVIDER),
    label: baseMetrics.map(labelGetter).join(', ') + labelPostfix,
  }

  return metric
}

function fetch(
  variables,
  metric: Studio.HolderDistributionMetric,
  cachePolicy?: CachePolicy,
) {
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
