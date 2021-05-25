import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'
import { getMetricKeyMinInterval } from '@/api/metrics/restrictions'
import { normalizeInterval } from '@/utils/intervals'

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

    return {
      getMetric: {
        timeseriesData: data,
      },
    } as QueryRecord<Timeseries>
  }

export function queryMetric(
  variables: Variables,
  precacher: (variables: Variables) => any = defaultPrecacher,
): Promise<any> {
  return getMetricKeyMinInterval(variables.metric as string).then(
    (minInterval) => {
      if (minInterval) {
        variables.interval = normalizeInterval(
          variables.interval || '',
          minInterval,
        )
      }

      return query<Timeseries>(GET_METRIC, {
        precacher,
        cacheTime: 600,
        variables,
      })
    },
  )
}