import type { CachePolicy } from 'webkit/api/cache'
import { create, all } from 'mathjs/number'
import { dataAccessor } from '@/api/timeseries'
import { queryMetric } from '@/api/timeseries/queries'

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
  const metric = {
    fetch,
    label: label.trim(),
    expression: normalizedExpression,
    baseMetrics,
    node: 'area',
    key: normalizedExpression,
  }

  return metric
}

function fetch(variables, metric: any, cachePolicy?: CachePolicy) {
  const { key, baseMetrics, expression } = metric

  const queries = baseMetrics.map(({ key, queryKey = key }) =>
    queryMetric(
      {
        ...variables,
        metric: queryKey,
      },
      undefined,
      cachePolicy,
    )
      .then(dataAccessor)
      .then((v) => {
        v.key = key
        return v
      }),
  )

  return Promise.all(queries).then((allData) => {
    const result = allData[0].map((v) => Object.assign({}, v))

    for (let i = 0, len = allData[0].length; i < len; i++) {
      const scope = {}
      for (let j = 0, xLen = allData.length; j < xLen; j++) {
        scope['x' + (j + 1)] = allData[j][i][key]
      }

      result[i][key] = math.evaluate(expression, scope)
    }

    return result
  })
}
