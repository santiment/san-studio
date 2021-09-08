import type { Query, QueryRecord } from 'webkit/api'
import type { Layout } from './index'
import type { UserLayoutsTemplate } from './index'
import type { UserLayoutsTemplate as UserShortLayoutsTemplate } from '../index'
import { mutate } from 'webkit/api'
import { updateUserLayoutsCache } from './index'
import { updateLayoutCache, updateUserShortLayoutsCache } from '../index'
import { dateSorter } from '../utils'

type MutatedLayout = Pick<Layout, 'id' | 'isPublic' | 'project' | 'user'>
type MutatedLayoutQuery = Query<'layout', MutatedLayout>
type CurrentUserLayouts = UserLayoutsTemplate & UserShortLayoutsTemplate

const newLayoutMutation = (mutation: string) => `
  mutation(
    $id: ID!
    $settings: ProjectChartInputObject!
  ) {
    layout:${mutation}(id: $id, settings: $settings) {
      id
      isPublic
			title
			options
			metrics
      project {
				projectId: id
				slug
				ticker
				name
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

function normalizeSettings(settings: LayoutUpdates) {
  const variables = Object.assign({}, settings)
  const { projectId, options } = variables

  if (projectId) variables.projectId = +projectId
  if (options) {
    if (typeof options === 'string') {
      settings.options = JSON.parse(options)
    } else {
      variables.options = JSON.stringify(options)
    }
  }

  return variables
}

// ------------------------------
// ------- UPDATE LAYOUT --------
// ------------------------------

const UPDATE_LAYOUT_MUTATION = newLayoutMutation('updateChartConfiguration')

type LayoutUpdates = Partial<
  Pick<Layout, 'title' | 'metrics' | 'options' | 'isPublic'>
> & {
  projectId?: number | string
  description?: string
}

function mutateLayoutsCacheOnUpdate(
  newLayout: MutatedLayout,
  settings: LayoutUpdates,
) {
  const layout = Object.assign(newLayout, settings, {
    updatedAt: new Date().toISOString(),
  }) as Layout

  const { id } = newLayout
  const updateLayout = (cachedLayout: Pick<Layout, 'id'>) =>
    +layout.id === +id && Object.assign(cachedLayout, layout)

  function updateCache(cached: QueryRecord<CurrentUserLayouts>) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser

    layouts.some(updateLayout)
    layouts.sort(dateSorter)

    return cached
  }

  updateUserLayoutsCache(updateCache)
  updateUserShortLayoutsCache(updateCache)
}

export const updateUserLayout = (
  id: number,
  settings: LayoutUpdates,
): Promise<MutatedLayout> =>
  mutate<MutatedLayoutQuery>(UPDATE_LAYOUT_MUTATION, {
    variables: { id, settings: normalizeSettings(settings) },
  }).then(
    ({ layout }) => (mutateLayoutsCacheOnUpdate(layout, settings), layout),
  )

// ------------------------------
// ------- CREATE LAYOUT --------
// ------------------------------

const CREATE_LAYOUT_MUTATION = newLayoutMutation('createChartConfiguration')

type LayoutCreation = Pick<Layout, 'title' | 'metrics' | 'options'> & {
  projectId: number | string
  description?: string
}

function mutateLayoutsCacheOnCreation(
  newLayout: MutatedLayout,
  settings: LayoutUpdates,
) {
  const layout = Object.assign(newLayout, settings, {
    updatedAt: new Date().toISOString(),
  }) as Layout

  function updateCache(cached: QueryRecord<CurrentUserLayouts>) {
    if (!cached.currentUser) return cached

    cached.currentUser.layouts.unshift(layout)
    return cached
  }

  updateUserLayoutsCache(updateCache)
  updateUserShortLayoutsCache(updateCache)
  updateLayoutCache(layout)
}

export const createUserLayout = (
  settings: LayoutCreation,
): Promise<MutatedLayout> =>
  mutate<MutatedLayoutQuery>(CREATE_LAYOUT_MUTATION, {
    variables: { settings: normalizeSettings(settings) },
  }).then(
    ({ layout }) => (mutateLayoutsCacheOnCreation(layout, settings), layout),
  )
