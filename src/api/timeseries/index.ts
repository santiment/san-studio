import type { Variables } from './queries'
import type { CachePolicy } from 'webkit/api/cache'
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
  cachePolicy?: CachePolicy,
) {
  let isAborted = false
  let data = [] as any[]
  const loadings = new Set(metrics)
  const errors = new Map()

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    const { key, reqMeta, fetch, precacher, selector = 'slug' } = metric as any
    const metricSettings = MetricSettings[key] || {}
    const { preTransform, fetcher = fetch } = metricSettings
    const queryKey = metricSettings.queryKey || metric.queryKey || key

    const { interval, slug, from, to, transform, owner, labels, holdersCount } =
      Object.assign({}, variables, metricSettings)

    // prettier-ignore
    const vars = Object.assign(
        { key, metric: queryKey, from, to, interval, transform, owner, labels, holdersCount , [selector]: slug },
      reqMeta,
    )

    let attempt = 1
    fetchData()
    function fetchData() {
      if (isAborted) return

      let request = fetcher
        ? fetcher(vars, metric, cachePolicy)
        : queryMetric(vars, precacher, cachePolicy).then(dataAccessor)
      request = preTransform ? request.then(preTransform) : request

      request
        .then((metricData) => {
          if (isAborted) return
          if (!metricData.length) throw new Error(NO_DATA_MSG)

          loadings.delete(metric)
          errors.delete(metric)
          onData((data = mergeTimeseries(data, metricData)), loadings)
          onError(errors, loadings)
        })
        .catch((e) => {
          if (isAborted) return
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

  return () => (isAborted = true)
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
