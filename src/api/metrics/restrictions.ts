import { query } from 'webkit/api'

const newQuery = (data: string) => `{ getAccessRestrictions {
      name
      ${data}
    }}`
const MIN_INTERVAL_QUERY = newQuery('minInterval')

type RestrictionMetric = { name: string }
type RestrictionQuery<T> = SAN.API.Query<'getAccessRestrictions', T[]>

type RestrictionMetricMinInterval = RestrictionMetric & { minInterval: string }
type MinIntervalQuery = RestrictionQuery<RestrictionMetricMinInterval>

type MetricMinInterval = {
  [metricKey: string]: RestrictionMetricMinInterval | undefined
}

function precacher() {
  return ({ getAccessRestrictions: data }: MinIntervalQuery) => {
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
export const queryMinInterval = (): Promise<MetricMinInterval> =>
  query<MinIntervalQuery>(MIN_INTERVAL_QUERY, options as any).catch(
    () => ({}),
  ) as any as Promise<MetricMinInterval>

export const getMetricKeyMinInterval = (metricKey: string) =>
  queryMinInterval().then((MetricMinInterval) => MetricMinInterval[metricKey]?.minInterval)

export const getMetricMinInterval = ({ key, queryKey = key }: Studio.Metric) =>
  getMetricKeyMinInterval(queryKey)

const RESTRICTED_DATES_QUERY = newQuery('restrictedFrom restrictedTo')
export const queryRestrictedDates = (): Promise<MetricMinInterval> =>
  query<MinIntervalQuery>(
    RESTRICTED_DATES_QUERY,
    options as any,
  ) as any as Promise<MetricMinInterval>
