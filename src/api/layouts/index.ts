import type { Query, QueryRecord } from 'webkit/api'
import type { Updater, Subscriber, Unsubscriber } from 'webkit/api/cache'
import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { dateSorter } from './utils'

const LAYOUT_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){
			id
			title
			options
			metrics
			project {
        projectId: id
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

const SHORT_LAYOUT_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){
			id
			title
    }
  }
`

const FEATURED_LAYOUTS_QUERY = `
  {
    layouts:featuredChartConfigurations{
			id
			title
    }
  }
`
export const USER_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts:chartConfigurations{
				id
				title
			  updatedAt
			}
    }
  }
`

const SHORT_LAYOUTS_QUERY = (slug: string) => `
  {
    layouts: chartConfigurations(projectSlug:"${slug}") {
			id
			title
			updatedAt
    }
  }
`
const LAYOUTS_QUERY = (slug: string) => `
  {
    layouts: chartConfigurations(projectSlug:"${slug}") {
			id
			title
			updatedAt
      isPublic
			project {
				projectId: id
				slug
				ticker
				name
			}
			metrics
			options
      user {
	      id
	      username
	      email
	      avatarUrl
      }
    }
  }
`

export type Layout = { id: number; title: string }
type LayoutsTemplate = Query<'layouts', Layout[]>

type ProjectLayout = Layout & { updatedAt: string }
type ProjectLayoutsTemplate = Query<'layouts', ProjectLayout[]>
export type UserLayoutsTemplate = Query<
  'currentUser',
  null | { layouts: ProjectLayout[] }
>

const accessor = <T extends Layout>({ layouts }: { layouts: T[] }) => layouts
export const queryFeaturedLayouts = (): Promise<Layout[]> =>
  query<LayoutsTemplate>(FEATURED_LAYOUTS_QUERY).then(accessor)

function precacher() {
  return (data: QueryRecord<ProjectLayoutsTemplate>) => {
    data.layouts.sort(dateSorter)
    return data
  }
}
const options = { precacher }
export const queryShortLayouts = (slug: string): Promise<ProjectLayout[]> =>
  query<ProjectLayoutsTemplate>(SHORT_LAYOUTS_QUERY(slug), options).then(
    accessor,
  )
export const queryLayouts = (slug: string): Promise<ProjectLayout[]> =>
  query<ProjectLayoutsTemplate>(LAYOUTS_QUERY(slug), options).then(accessor)

function userLayoutsPrecacher() {
  return (data: QueryRecord<UserLayoutsTemplate>) => {
    if (data.currentUser) data.currentUser.layouts.sort(dateSorter)
    return data
  }
}
const userLayoutsOptions = { precacher: userLayoutsPrecacher }
const userLayoutsAccessor = ({
  currentUser,
}: QueryRecord<UserLayoutsTemplate>) => currentUser?.layouts || []
export const queryUserLayouts = (): Promise<ProjectLayout[]> =>
  query<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, userLayoutsOptions).then(
    userLayoutsAccessor,
  )

export const updateUserShortLayoutsCache = (
  updateCache: Updater<UserLayoutsTemplate>,
) => Cache.set$<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, updateCache)
export const subscribeUserShortLayoutsCache = (
  clb: Subscriber<UserLayoutsTemplate>,
): Unsubscriber => Cache.get$<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, clb)

export type DetailedLayout = Layout & {
  metrics: string[]
  description?: string
  options?: {
    multi_chart: boolean
    widgets: any
  }
  project: {
    name: string
    slug: string
    ticker: string
    projectId: string
  }
  user: {
    id: number
    username: null | string
    email: null | string
    avatarUrl: null | string
  }
}
const layoutAccessor = ({ layout }) => layout
export const queryLayout = (id: number): Promise<DetailedLayout> =>
  query<any>(LAYOUT_QUERY(id)).then(layoutAccessor)
export const updateLayoutCache = (layout: DetailedLayout) =>
  Cache.set<any>(LAYOUT_QUERY(layout.id), { layout })

export const queryShortLayout = (id: number): Promise<Layout> =>
  query<any>(SHORT_LAYOUT_QUERY(id)).then(layoutAccessor)
