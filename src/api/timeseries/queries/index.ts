import { query } from 'webkit/api'
import { getMetricKeyMinInterval } from '@/api/metrics/restrictions'
import { normalizeInterval } from '@/utils/intervals'

export const GET_METRIC = `
  query getMetric(
    $metric: String!
    $from: DateTime!
    $to: DateTime!
    $slug: String
    $watchlistSlug: String
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
    $aggregation: Aggregation
    $label_fqn: String
  ) {
    getMetric(metric: $metric) {
      timeseriesData(
        selector: {
          slug: $slug
          watchlistSlug: $watchlistSlug
          text: $text
          slugs: $slugs
          labels: $labels
          holdersCount: $holdersCount
          market_segments: $market_segments
          ignored_slugs: $ignored_slugs
          source: $source
          owner: $owner
          label: $label
          label_fqn: $label_fqn
        }
        from: $from
        to: $to
        interval: $interval
        transform: $transform
        aggregation: $aggregation
        includeIncompleteData: false
      ) {
        d: datetime
        v: value
      }
    }
  }
`

export type RawTimeseries = SAN.API.Query<
  'getMetric',
  {
    timeseriesData: {
      d: string
      v: number
    }[]
  }
>

export type MetricTimeseries = { datetime: number; [key: string]: number }[]
export type Timeseries = SAN.API.Query<'getMetric', { timeseriesData: MetricTimeseries }>

export type Variables = {
  key: string
  metric?: string
  from: string
  to: string
  slug: string
  interval?: string
}

// TODO: defaultPrecacher using newPrecacher constructor [@vanguard | May 24, 2021]
const defaultPrecacher =
  ({ key }: Variables) =>
  ({ getMetric: { timeseriesData } }: RawTimeseries): Timeseries => {
    const data: Timeseries['getMetric']['timeseriesData'] = new Array(timeseriesData.length)

    for (let i = timeseriesData.length - 1; i > -1; i--) {
      const { d, v } = timeseriesData[i]
      data[i] = {
        datetime: +new Date(d),
        [key as any]: v,
      }
    }

    return {
      getMetric: {
        timeseriesData: data,
      },
    } as Timeseries
  }

export function queryMetric(
  variables: Variables,
  precacher: (variables: Variables) => any = defaultPrecacher,
  cachePolicy?: SAN.API.CachePolicy,
): Promise<any> {
  return getMetricKeyMinInterval(variables.metric as string).then((minInterval) => {
    if (minInterval) {
      variables.interval = normalizeInterval(variables.interval || '', minInterval)
    }

    return query<Timeseries>(GET_METRIC, {
      precacher,
      cachePolicy,
      variables,
    })
  })
}
