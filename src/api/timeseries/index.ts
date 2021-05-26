import type { Variables } from './queries'
import { queryMetric } from './queries'
import { NO_DATA_MSG, transformMessage } from './errors'
import { mergeTimeseries } from './utils'

export const dataAccessor = ({ getMetric }) => getMetric.timeseriesData
export function getTimeseries(
  metrics: Studio.Metric[],
  variables: Omit<Variables, 'key'>,
  onData: (data: any[], loadings: Set<Studio.Metric>) => any,
  onError: (
    errors: Map<Studio.Metric, string>,
    loadings: Set<Studio.Metric>,
    data?: any[],
  ) => any,
  MetricSettings: any = {},
) {
  let data = [] as any[]
  const loadings = new Set(metrics)
  const errors = new Map()

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    const { key, queryKey = key, reqMeta, fetch, precacher } = metric as any
    const metricSettings = MetricSettings[key]
    const { preTransform, fetcher = fetch } = metricSettings || {}
    const { interval, slug, from, to, transform } = Object.assign(
      {},
      variables,
      metricSettings,
    )

    const vars = Object.assign(
      { key, metric: queryKey, slug, from, to, interval, transform },
      reqMeta,
    )

    let attempt = 1
    fetchData()
    function fetchData() {
      let request = fetcher
        ? fetcher(vars, metric)
        : queryMetric(vars, precacher).then(dataAccessor)
      request = preTransform ? request.then(preTransform) : request

      request
        .then((metricData) => {
          if (!metricData.length) throw new Error(NO_DATA_MSG)

          loadings.delete(metric)
          errors.delete(metric)
          onData((data = mergeTimeseries(data, metricData)), loadings)
          onError(errors, loadings)
        })
        .catch((e) => {
          const msg = e.message as string | undefined
          if (msg && msg.includes('Failed to fetch') && attempt < 5) {
            attempt += 1
            return setTimeout(fetchData, 2000)
          }

          console.warn(e)
          loadings.delete(metric)
          errors.set(metric, transformMessage(e))
          onError(errors, loadings, data)
        })
    }
  }

  // TODO: Return abort controller [@vanguard | May 26, 2021]
}

export const CRYPTO_ERA_START_DATE = '2009-01-01T01:00:00.000Z'
export function getAllTimeData(
  metrics: Studio.Metric[],
  slug: string,
  onData,
  onError,
) {
  return getTimeseries(
    metrics,
    {
      from: CRYPTO_ERA_START_DATE,
      to: 'utc_now',
      interval: '4d',
      slug,
    },
    onData,
    onError,
  )
}
