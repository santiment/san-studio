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

const dataAccessor = ({ projectBySlug }: QueryRecord<ProjectMetrics>) =>
  projectBySlug.availableMetrics.concat(projectBySlug.availableQueries)
export const queryProjectMetrics = (
  slug: string,
  // ): Promise<QueryRecord<ProjectMetrics>> =>
): Promise<string[]> =>
  query<ProjectMetrics>(PROJECT_AVAILABLE_METRIC_QUERY(slug)).then(dataAccessor)
