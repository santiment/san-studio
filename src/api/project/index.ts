import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const PROJECT_NAME_QUERY = (slug: string) => `
  {
    projectBySlug(slug:"${slug}") { name }
  }
`

const PROJECT_PRICE_AND_CHANGE_QUERY = (slug: string) => `
  {
    projectBySlug(slug:"${slug}") {
			priceUsd
			percentChange24h
    }
  }
`

export type ProjectPriceChange = { priceUsd: number; percentChange24h: number }
type ProjectPriceChangeQuery = Query<'projectBySlug', ProjectPriceChange>

const accessor = ({ projectBySlug }: QueryRecord<ProjectPriceChangeQuery>) =>
  projectBySlug
export const queryProjectPriceChange = (
  slug: string,
): Promise<ProjectPriceChange> =>
  query<ProjectPriceChangeQuery>(PROJECT_PRICE_AND_CHANGE_QUERY(slug)).then(
    accessor,
  )

const nameAccessor = ({ projectBySlug }) => projectBySlug.name
export const queryProjectName = (slug: string): Promise<string> =>
  query<any>(PROJECT_NAME_QUERY(slug)).then(nameAccessor)
