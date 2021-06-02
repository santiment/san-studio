import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const PROJECT_AVAILABLE_METRIC_QUERY = (slug: string): string => `
  {
    projectBySlug(slug: "${slug}") {
      availableMetrics
      availableQueries
    }
  }
`
type ProjectMetrics = Query<
  'projectBySlug',
  { availableMetrics: string[]; availableQueries: string[] }
>

function precacher() {
  return ({ projectBySlug }) => {
    const { availableMetrics, availableQueries } = projectBySlug
    const metricsSet = new Set(
      ['percent_of_whale_stablecoin_total_supply']
        .concat(availableMetrics)
        .concat(availableQueries),
    )
    return Array.from(metricsSet)
  }
}
const options = { precacher }

export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<string[]> =>
  query<any>(PROJECT_AVAILABLE_METRIC_QUERY(slug), options) as any
