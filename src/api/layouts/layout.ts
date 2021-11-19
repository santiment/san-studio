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
      description
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

type LayoutQuery = Query<'layout', SAN.Layout>

export const queryLayout = (id: number): Promise<SAN.Layout> =>
  query<LayoutQuery>(LAYOUT_QUERY(id)).then(layoutAccessor)

export const updateLayoutCache = (layout: SAN.Layout): void =>
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

type ShortLayoutQuery = Query<'layout', SAN.ShortLayout>

export const queryShortLayout = (id: number): Promise<SAN.ShortLayout> =>
  query<ShortLayoutQuery>(SHORT_LAYOUT_QUERY(id)).then(layoutAccessor)
