import { query } from 'webkit/api'

const PROJECT_NAME_QUERY = (slug: string) => `
  {
    projectBySlug(slug:"${slug}") {
      name
      ticker
      logoUrl
      projectId: id
    }
  }
`

const PROJECT_PRICE_AND_CHANGE_QUERY = (slug: string) => `
  {
    projectBySlug(slug:"${slug}") {
			priceUsd
			percentChange24h
      marketcapUsd
      rank
    }
  }
`

export type ProjectPriceChange = {
  priceUsd: number
  percentChange24h: number
  marketcapUsd: number
  rank: number
}
type ProjectPriceChangeQuery = SAN.API.Query<'projectBySlug', ProjectPriceChange>

const accessor = ({ projectBySlug }: ProjectPriceChangeQuery) => projectBySlug
export const queryProjectPriceChange = (slug: string): Promise<ProjectPriceChange> =>
  query<ProjectPriceChangeQuery>(PROJECT_PRICE_AND_CHANGE_QUERY(slug)).then(accessor)

const projectAccessor = ({ projectBySlug }) => projectBySlug
export const queryProject = (slug: string): Promise<string> =>
  query<any>(PROJECT_NAME_QUERY(slug)).then(projectAccessor)

let ALL_PROJECTS = `
  {
    allProjects(minVolume:0){
      slug
      ticker
      name
      priceUsd
      infrastructure
      logoUrl
    }
  }
`
export const APPEND_ALL_PROJECTS_QUERY = (scheme: string) => {
  ALL_PROJECTS = ALL_PROJECTS.replace('logoUrl', 'logoUrl ' + scheme)
}

const projectsAccessor = ({ allProjects }) => allProjects
export const queryAllProjects = (): Promise<any[]> =>
  query<any>(ALL_PROJECTS).then(projectsAccessor)
