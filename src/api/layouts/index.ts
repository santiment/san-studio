import type { Query, QueryRecord } from 'webkit/api'
import { query } from 'webkit/api'

const FEATURED_LAYOTUS_QUERY = `
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
    layouts: chartConfigurations(projectId: 57) {
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
  query<LayoutsTemplate>(FEATURED_LAYOTUS_QUERY).then(accessor)

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
