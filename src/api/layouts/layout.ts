import type { Query } from 'webkit/api'
import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { layoutAccessor } from './utils'

// --------------------
// ------ LAYOUT ------
// --------------------

export const LAYOUT_QUERY_FIELDS = `id
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
			}`

const LAYOUT_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){
      ${LAYOUT_QUERY_FIELDS}
      isPublic
	  }
  }
`

export type Layout = {
  id: number
  title: string
  metrics: string[]
  options: { widgets?: { [key: string]: any }[] }
  project: {
    projectId: string
    name: string
    slug: string
    ticker: string
  }
  user: {
    id: number
    username: string | null
    email: string | null
    avatarUrl: string | null
  }
}
type LayoutQuery = Query<'layout', Layout>

export const queryLayout = (id: number): Promise<Layout> =>
  query<LayoutQuery>(LAYOUT_QUERY(id)).then(layoutAccessor)

export const updateLayoutCache = (layout: Layout): void =>
  Cache.set<LayoutQuery>(LAYOUT_QUERY(layout.id), { layout })

// --------------------------
// ------ SHORT LAYOUT ------
// --------------------------

const SHORT_LAYOUT_QUERY = (id: number) => `
  {
    layout:chartConfiguration(id:${id}){
			id
			title
    }
  }
`

export type ShortLayout = Pick<Layout, 'id' | 'title'>
type ShortLayoutQuery = Query<'layout', ShortLayout>

export const queryShortLayout = (id: number): Promise<ShortLayout> =>
  query<ShortLayoutQuery>(SHORT_LAYOUT_QUERY(id)).then(layoutAccessor)
