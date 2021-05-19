import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'
import { mergeTimeseries } from './utils'
import { NO_DATA_MSG, transformMessage } from './errors'

export const GET_METRIC = `
  query getMetric(
    $metric: String!
    $from: DateTime!
    $to: DateTime!
    $slug: String
    $text: String
    $slugs: [String]
    $interval: interval
    $transform: TimeseriesMetricTransformInputObject
    $holdersCount: Int
    $market_segments: [String]
    $ignored_slugs: [String]
    $source: String
    $owner: String
    $label: String
    $labels: [String]
  ) {
    getMetric(metric: $metric) {
      timeseriesData(
        selector: {
          slug: $slug
          text: $text
          slugs: $slugs
          labels: $labels
          holdersCount: $holdersCount
          market_segments: $market_segments
          ignored_slugs: $ignored_slugs
          source: $source
          owner: $owner
          label: $label
        }
        from: $from
        to: $to
        interval: $interval
        transform: $transform
      ) {
        d: datetime
        v: value
      }
    }
  }
`

export type RawTimeseries = Query<
  'getMetric',
  {
    timeseriesData: {
      d: string
      v: number
    }[]
  }
>

export type MetricTimeseries = { datetime: number; [key: string]: number }[]
export type Timeseries = Query<
  'getMetric',
  { timeseriesData: MetricTimeseries }
>

type Variables = {
  key: string
  metric?: string
  from: string
  to: string
  slug: string
  interval?: string
}

const precacher =
  ({ key }: Variables) =>
  ({
    getMetric: { timeseriesData },
  }: QueryRecord<RawTimeseries>): QueryRecord<Timeseries> => {
    const data: Timeseries['timeseriesData'] = new Array(timeseriesData.length)

    for (let i = timeseriesData.length - 1; i > -1; i--) {
      const { d, v } = timeseriesData[i]
      data[i] = {
        datetime: +new Date(d),
        [key as any]: v,
      }
    }
    console.log('precacher recalc')

    return {
      getMetric: {
        timeseriesData: data,
      },
    } as QueryRecord<Timeseries>
  }

export function queryMetric(variables: Variables): Promise<any> {
  return query<Timeseries>(GET_METRIC, {
    precacher,
    cacheTime: 600,
    variables,
  })
}

export const dataAccessor = ({ getMetric }) => getMetric.timeseriesData
export function getTimeseries(
  metrics: Studio.Metric[],
  variables: Omit<Variables, 'key'>,
  onData: any,
  onError: any,
  MetricSettings: any = {},
) {
  let data = [] as any[]
  const requests = new Array(metrics.length)
  const loadings = new Set(metrics)
  const errors = new Map()

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i]
    const { key, queryKey = key, reqMeta, fetch } = metric as any
    const { interval, slug, from, to, transform } = Object.assign(
      {},
      variables,
      MetricSettings[key],
    )

    const vars = Object.assign(
      { key, metric: queryKey, slug, from, to, interval, transform },
      reqMeta,
    )
    const request = fetch
      ? fetch(metric, vars)
      : queryMetric(vars).then(dataAccessor)

    requests[i] = request
      .then((metricData) => {
        if (!metricData.length) throw new Error(NO_DATA_MSG)

        loadings.delete(metric)
        onData((data = mergeTimeseries(data, metricData)), loadings)
      })
      .catch((e) => {
        loadings.delete(metric)
        console.warn(e)
        errors.set(metric, transformMessage(e.message))
        onError(errors, loadings)
      })
  }

  return Promise.all(requests)
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
