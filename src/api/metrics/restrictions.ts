import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const newQuery = (data: string) => `
  {
    getAccessRestrictions {
      name
      ${data}
    }
  }
`
const MIN_INTERVAL_QUERY = newQuery('minInterval')
const BOUNDARIES_QUERY = newQuery('restrictedFrom restrictedTo')

type RestrictionQuery = Query<
  'getAccessRestrictions',
  {
    name: string
  }
>

type MinInterval = RestrictionQuery & {
  minInterval: string
}

type BoundariesQuery = RestrictionQuery & {
  restrictedFrom: string
  restrictedTo: string
}

type MetricMinInterval = {
  [metricKey: string]: MinInterval | undefined
}

function precacher() {
  return ({ getAccessRestrictions: data }) => {
    const MetricMinInterval = {} as MetricMinInterval
    const { length } = data
    for (let i = 0; i < length; i++) {
      const restriction = data[i]
      MetricMinInterval[restriction.name] = restriction
    }
    return MetricMinInterval
  }
}

const options = { precacher }
export const queryMinInterval = () =>
  query<MinInterval>(
    MIN_INTERVAL_QUERY,
    options,
  ) as any as Promise<MetricMinInterval>

export const getMetricMinInterval = ({ key, queryKey = key }: Studio.Metric) =>
  queryMinInterval().then(
    (MetricMinInterval) => MetricMinInterval[queryKey]?.minInterval,
  )
