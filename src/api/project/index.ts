import { query } from 'webkit/api'

const PROJECT_NAME_QUERY = (slug: string) => `
  {
    projectBySlug(slug:"${slug}") {
      name
      ticker
      projectId: id
    }
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
type ProjectPriceChangeQuery = SAN.API.Query<
  'projectBySlug',
  ProjectPriceChange
>

const accessor = ({ projectBySlug }: ProjectPriceChangeQuery) => projectBySlug
export const queryProjectPriceChange = (
  slug: string,
): Promise<ProjectPriceChange> =>
  query<ProjectPriceChangeQuery>(PROJECT_PRICE_AND_CHANGE_QUERY(slug)).then(
    accessor,
  )

const projectAccessor = ({ projectBySlug }) => projectBySlug
export const queryProject = (slug: string): Promise<string> =>
  query<any>(PROJECT_NAME_QUERY(slug)).then(projectAccessor)

const ALL_PROJECTS = `
  {
    allProjects(minVolume:0){
      slug
      ticker
      name
    }
  }
`

const projectsAccessor = ({ allProjects }) => allProjects
export const queryAllProjects = (): Promise<string[]> =>
  query<any>(ALL_PROJECTS).then(projectsAccessor)
