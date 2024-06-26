import type { Variables } from './queries'
import type { CachePolicy } from 'webkit/api/cache'

import { Node } from '@/Chart/nodes'
import { queryMetric } from './queries'
import { NO_DATA_MSG, transformMessage } from './errors'
import { mergeTimeseries } from './utils'

function getMetricSettings(metric: Studio.Metric, MetricSettings) {
  let metricSettings = MetricSettings[metric.key] || {}

  if (metric.indicator) {
    const { node, ...baseSettings } = MetricSettings[metric.base.key] || {}

    if (node === Node.CANDLES) {
      delete baseSettings.fetcher
    }

    metricSettings = Object.assign({}, metricSettings, baseSettings)
  }

  return metricSettings
}

export const dataAccessor = ({ getMetric }) => getMetric.timeseriesData
export function getTimeseries(
  metrics: Studio.Metric[],
  variables: Omit<Variables, 'key'>,
  onData: (data: any[], loadings: Set<Studio.Metric>) => any,
  onError: (errors: Map<Studio.Metric, string>, loadings: Set<Studio.Metric>, data?: any[]) => any,
  MetricSettings: any = {},
  cachePolicy?: CachePolicy,
  requestOptions?: SAN.API.RequestOptions,
): () => any {
  let isAborted = false
  let data = [] as any[]
  const loadings = new Set(metrics)
  const errors = new Map()

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    const { key, reqMeta, fetch, precacher } = metric as any
    const metricSettings = getMetricSettings(metric, MetricSettings)
    const { preTransform, fetcher = fetch, selector = metric.selector || 'slug' } = metricSettings
    const queryKey = metricSettings.queryKey || metric.queryKey || key

    // prettier-ignore
    const { interval, slug, from, to, transform, owner, labels, holdersCount, label_fqn, address } =
      Object.assign({}, variables, metricSettings)

    // prettier-ignore
    const vars = Object.assign(
      { key, metric: queryKey, from, to, interval, transform, owner, labels, holdersCount, label_fqn, [selector]: slug, address },
      reqMeta,
    )

    if (reqMeta?.slug) delete vars.address

    if (typeof vars.label_fqn === 'function') {
      vars.label_fqn = vars.label_fqn({ slug: vars.slug })
    }

    if (vars.address) {
      delete vars.slug
      if ((metric as any).isNFTMetric) {
        vars.nftAddress = vars.address
        delete vars.address
      }
    }

    let attempt = 1
    fetchData()
    function fetchData() {
      if (isAborted) return

      let request = fetcher
        ? fetcher(vars, metric, cachePolicy, requestOptions)
        : queryMetric(vars, precacher, cachePolicy, requestOptions).then(dataAccessor)
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

export const CRYPTO_ERA_START_DATE = '2009-01-05T01:00:00.000Z'
export function getAllTimeData(
  metrics: Studio.Metric[],
  selector: { [key: string]: string },
  onData,
  onError,
) {
  return getTimeseries(
    metrics,
    Object.assign(selector, {
      from: CRYPTO_ERA_START_DATE,
      to: 'utc_now',
      interval: '4d',
    }) as any,
    onData,
    onError,
  )
}
