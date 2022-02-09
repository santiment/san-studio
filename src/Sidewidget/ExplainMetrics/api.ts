import { query } from 'webkit/api'

const QUERY = (metric: string, slug: string) => `{
  getMetric(metric:"${metric}") {
    availableSince(slug:"${slug}")
    lastDatetimeComputedAt(slug:"${slug}")
  }
}`

type MetricInfoQuery = SAN.API.Query<
  'getMetric',
  {
    availableSince: string
    lastDatetimeComputedAt: string
  }
>

const accessor = ({ getMetric }: MetricInfoQuery) => getMetric
export const queryMetricInfo = (metric: string, slug: string) =>
  query<MetricInfoQuery>(QUERY(metric, slug)).then(accessor)
