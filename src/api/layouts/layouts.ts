import type { Query } from 'webkit/api'
import type { Layout, ShortLayout } from './layout'
import { query } from 'webkit/api'
import { sortableLayoutsOptions, layoutsAccessor } from './utils'
import { LAYOUT_QUERY_FIELDS } from './layout'

export type SortedShortLayout = ShortLayout & { updatedAt: string }

// --------------------------------------------
// ------ FEATURED/PROJECT SHORT LAYOUTS ------
// --------------------------------------------

const FEATURED_SHORT_LAYOUTS_QUERY = `
  {
    layouts:featuredChartConfigurations{
			id
			title
    }
  }
`

const SHORT_LAYOUTS_QUERY = (slug: string) => `
  {
    layouts:chartConfigurations(projectSlug:"${slug}") {
			id
			title
			updatedAt
    }
  }
`

type ShortLayoutsQuery = Query<'layouts', ShortLayout[]>

export const queryFeaturedShortLayouts = (): Promise<ShortLayout[]> =>
  query<ShortLayoutsQuery>(FEATURED_SHORT_LAYOUTS_QUERY).then(layoutsAccessor)

type SortedShortLayoutQuery = Query<'layouts', SortedShortLayout[]>

export const queryShortLayouts = (slug: string): Promise<SortedShortLayout[]> =>
  query<SortedShortLayoutQuery>(
    SHORT_LAYOUTS_QUERY(slug),
    sortableLayoutsOptions,
  ).then(layoutsAccessor)

// -----------------------------
// ------ PROJECT LAYOUTS ------
// -----------------------------

const PROJECT_LAYOUTS_QUERY = (slug: string) => `
  {
    layouts:chartConfigurations(projectSlug:"${slug}") {
      ${LAYOUT_QUERY_FIELDS}
			updatedAt
      isPublic
    }
  }
`

type ProjectLayout = Layout & SortedShortLayout & { isPublic: boolean }
type ProjectLayoutQuery = Query<'layouts', ProjectLayout[]>

export const queryLayouts = (slug: string): Promise<ProjectLayout[]> =>
  query<ProjectLayoutQuery>(
    PROJECT_LAYOUTS_QUERY(slug),
    sortableLayoutsOptions,
  ).then(layoutsAccessor)
