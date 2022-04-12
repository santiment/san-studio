import { query } from 'webkit/api'
import { NO_PROJECT_METRICS } from '@/metrics/withoutProject'

const PROJECT_AVAILABLE_METRIC_QUERY = (slug: string): string => `
  {
    projectBySlug(slug: "${slug}") {
      availableMetrics
      availableQueries
    }
  }
`
type ProjectMetrics = SAN.API.Query<
  'projectBySlug',
  { availableMetrics: string[]; availableQueries: string[] }
>

function precacher() {
  return ({ projectBySlug }) => {
    const { availableMetrics, availableQueries } = projectBySlug
    const metricsSet = new Set(NO_PROJECT_METRICS.concat(availableMetrics).concat(availableQueries))
    return Array.from(metricsSet)
  }
}
const options = { precacher }

const catchMetrics = () => ['price_usd']
export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<string[]> =>
  query<any>(
    // TODO: Remove stablecoins check when backend is ready [@vanguard | Jun  9, 2021]
    PROJECT_AVAILABLE_METRIC_QUERY(slug === 'stablecoins' ? 'tether' : slug),
    options,
  ).catch(catchMetrics) as any
