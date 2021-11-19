import type { Query } from 'webkit/api'
import { query } from 'webkit/api'
import { sortableLayoutsOptions, layoutsAccessor } from './utils'
import { LAYOUT_QUERY_FIELDS } from './layout'

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

type ShortLayoutsQuery = Query<'layouts', SAN.ShortLayout[]>

export const queryFeaturedShortLayouts = (): Promise<SAN.ShortLayout[]> =>
  query<ShortLayoutsQuery>(FEATURED_SHORT_LAYOUTS_QUERY).then(layoutsAccessor)

type SortedShortLayoutQuery = Query<'layouts', SAN.SortedShortLayout[]>

export const queryShortLayouts = (
  slug: string,
): Promise<SAN.SortedShortLayout[]> =>
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

type ProjectLayoutQuery = Query<'layouts', SAN.ProjectLayout[]>

export const queryLayouts = (slug: string): Promise<SAN.ProjectLayout[]> =>
  query<ProjectLayoutQuery>(
    PROJECT_LAYOUTS_QUERY(slug),
    sortableLayoutsOptions,
  ).then(layoutsAccessor)
