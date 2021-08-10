import type { CachePolicy } from 'webkit/api/cache'
import { create, all } from 'mathjs/number'
import { dataAccessor } from '@/api/timeseries'
import { queryMetric } from '@/api/timeseries/queries'

const math = create(all)

export function newExpessionMetric(baseMetrics: any[], expression: string) {
  const metric = {
    fetch,
    expression,
    baseMetrics,
    node: 'area',
    color: '#14c393',
    key: 'expression_test',
    label: 'Expression Metric',
  }

  return metric
}

function fetch(variables, metric: any, cachePolicy?: CachePolicy) {
  console.log(variables, metric)
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
