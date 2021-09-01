import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const LAYOUT_QUERY = (id: number) => `
  {
    chartConfiguration(id:${id}){
			id
			title
			options
			metrics
			project {
				name
				slug
				ticker
			}
			user {
				id
				username
				email
				avatarUrl
			}
    }
  }
`

const FEATURED_LAYOUTS_QUERY = `
  {
    layouts: featuredChartConfigurations{
			id
			title
    }
  }
`
const USER_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts: chartConfigurations{
				id
				title
			}
    }
  }
`

const LAYOUTS_QUERY = (slug: string) => `
  {
    layouts: chartConfigurations(projectSlug:"${slug}") {
			id
			title
			updatedAt
    }
  }
`

type Layout = { id: number; title: number }
type LayoutsTemplate = Query<'layouts', Layout[]>

type ProjectLayout = Layout & { updatedAt: string }
type ProjectLayoutsTemplate = Query<'layouts', ProjectLayout[]>
type UserLayoutsTemplate = Query<'currentUser', { layouts: ProjectLayout[] }>

const accessor = <T extends Layout>({ layouts }: { layouts: T[] }) => layouts
export const queryFeaturedLayouts = (): Promise<Layout[]> =>
  query<LayoutsTemplate>(FEATURED_LAYOUTS_QUERY).then(accessor)

const dateSorter = ({ updatedAt: a }, { updatedAt: b }) =>
  +new Date(b) - +new Date(a)
function precacher() {
  return (data: QueryRecord<ProjectLayoutsTemplate>) => {
    data.layouts.sort(dateSorter)
    return data
  }
}
const options = { precacher }
export const queryLayouts = (slug: string): Promise<ProjectLayout[]> =>
  query<ProjectLayoutsTemplate>(LAYOUTS_QUERY(slug), options).then(accessor)

function userLayoutsPrecacher() {
  return (data: QueryRecord<UserLayoutsTemplate>) => {
    data.currentUser.layouts.sort(dateSorter)
    return data
  }
}
const userLayoutsOptions = { precacher: userLayoutsPrecacher }
const userLayoutsAccessor = ({
  currentUser,
}: QueryRecord<UserLayoutsTemplate>) => currentUser.layouts
export const queryUserLayouts = (): Promise<ProjectLayout[]> =>
  query<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, userLayoutsOptions).then(
    userLayoutsAccessor,
  )

export type DetailedLayout = Layout & {
  metrics: string[]
  options?: {
    multi_chart: boolean
    widgets: any
  }
  project: {
    name: string
    slug: string
    ticker: string
  }
  user: {
    id: string
    username: null | string
    email: null | string
    avatarUrl: null | string
  }
}
const layoutAccessor = ({ chartConfiguration }) => chartConfiguration
export const queryLayout = (id: number): Promise<DetailedLayout> =>
  query<any>(LAYOUT_QUERY(id)).then(layoutAccessor)
