import { queryMetric } from './queries'
import { NO_DATA_MSG, transformMessage } from './errors'
import { mergeTimeseries } from './utils'
export const dataAccessor = ({ getMetric }) => getMetric.timeseriesData
export function getTimeseries(
  metrics,
  variables,
  onData,
  onError,
  MetricSettings = {},
  cachePolicy,
  requestOptions,
) {
  let isAborted = false
  let data = []
  const loadings = new Set(metrics)
  const errors = new Map()
  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    const { key, reqMeta, fetch, precacher, selector = 'slug' } = metric
    const metricSettings = MetricSettings[key] || {}
    const { preTransform, fetcher = fetch } = metricSettings
    const queryKey = metricSettings.queryKey || metric.queryKey || key
    // prettier-ignore
    const { interval, slug, from, to, transform, owner, labels, holdersCount, label_fqn, address } = Object.assign({}, variables, metricSettings);
    // prettier-ignore
    const vars = Object.assign({ key, metric: queryKey, from, to, interval, transform, owner, labels, holdersCount, label_fqn, [selector]: slug, address }, reqMeta);
    if (reqMeta === null || reqMeta === void 0 ? void 0 : reqMeta.slug) delete vars.address
    if (vars.address) {
      delete vars.slug
      if (metric.isNFTMetric) {
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
          const msg = e.message
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
export function getAllTimeData(metrics, selector, onData, onError) {
  return getTimeseries(
    metrics,
    Object.assign(selector, {
      from: CRYPTO_ERA_START_DATE,
      to: 'utc_now',
      interval: '4d',
    }),
    onData,
    onError,
  )
}
//# sourceMappingURL=index.js.map
