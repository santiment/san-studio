import type { CachePolicy } from 'webkit/api/cache'
import { create, all } from 'mathjs/number'
import { getIntervalMilliseconds, normalizeInterval } from '@/utils/intervals'
import { dataAccessor } from '@/api/timeseries'
import { queryMetric } from '@/api/timeseries/queries'
import { getMetricMinInterval } from '@/api/metrics/restrictions'

const math = create(all)

export function checkIsExpressionValid(metrics: any[], expression: string) {
  try {
    const scope = {}
    for (let i = 1, len = metrics.length; i <= len; i++) scope['x' + i] = 1
    math.evaluate(expression, scope)
    return true
  } catch (e) {
    console.warn(e)
    return false
  }
}

export function newExpessionMetric(
  baseMetrics: Studio.Metric[],
  expression: string,
  label: string,
) {
  const normalizedExpression = expression.trim()
  const normalizedLabel = label.trim()
  const metric = {
    fetch,
    label: normalizedLabel,
    expression: normalizedExpression,
    baseMetrics,
    node: 'area',
    key: normalizedExpression + '|' + normalizedLabel + '|' + Date.now(),
  }

  return metric
}

function getCommonMinInterval(intervals: string[]): string {
  let minInterval = intervals[0]
  let minIntervalMiliseconds = getIntervalMilliseconds(minInterval)
  for (let i = 1, len = intervals.length; i < len; i++) {
    const interval = intervals[i]
    const intervalMiliseconds = getIntervalMilliseconds(interval)
    if (minIntervalMiliseconds < intervalMiliseconds) {
      minInterval = interval
      minIntervalMiliseconds = intervalMiliseconds
    }
  }
  return minInterval
}

const COMBINED_KEY = 'COMBINED_KEY'
function fetch(variables, metric: any, cachePolicy?: CachePolicy) {
  const { key, baseMetrics, expression } = metric

  const minIntervalPromise = Promise.all(baseMetrics.map(getMetricMinInterval))
    .then(getCommonMinInterval)
    .then((minInterval) => (metric.minInterval = minInterval))

  const queries = baseMetrics.map(({ key, queryKey = key }) =>
    minIntervalPromise
      .then((minInterval) =>
        queryMetric(
          {
            ...variables,
            metric: queryKey,
            key: COMBINED_KEY,
            interval: normalizeInterval(variables.interval || '', minInterval),
          },
          undefined,
          cachePolicy,
        ),
      )
      .then(dataAccessor),
  )

  return Promise.all(queries).then((allData) => {
    const result = allData[0].map((data) => ({
      datetime: data.datetime,
      [key]: data[COMBINED_KEY],
    }))

    for (let i = 0, len = allData[0].length; i < len; i++) {
      const scope = {}
      for (let j = 0, xLen = allData.length; j < xLen; j++) {
        scope['x' + (j + 1)] = allData[j][i][COMBINED_KEY]
      }
      result[i][key] = math.evaluate(expression, scope)
    }

    return result
  })
}
