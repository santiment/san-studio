import type { Query, QueryRecord } from 'webkit/api'
import type { Layout } from './index'
import type { UserLayoutsTemplate } from './index'
import type { UserLayoutsTemplate as UserShortLayoutsTemplate } from '../index'
import { mutate } from 'webkit/api'
import { updateUserLayoutsCache } from './index'
import { updateLayoutCache, updateUserShortLayoutsCache } from '../index'
import { dateSorter } from '../utils'

type MutatedLayoutQuery = Query<'layout', Layout>
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
      updatedAt
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

function mutateLayoutsCacheOnUpdate(newLayout: Layout) {
  const id = +newLayout.id
  const updateLayout = (cachedLayout: Pick<Layout, 'id'>) =>
    +cachedLayout.id === id && Object.assign(cachedLayout, newLayout)

  function updateCache(cached: QueryRecord<CurrentUserLayouts>) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser

    layouts.some(updateLayout)
    layouts.sort(dateSorter)

    return cached
  }

  updateUserLayoutsCache(updateCache)
  updateUserShortLayoutsCache(updateCache)
  updateLayoutCache(newLayout)

  return newLayout
}

export const updateUserLayout = (
  id: number,
  settings: LayoutUpdates,
): Promise<Layout> =>
  mutate<MutatedLayoutQuery>(UPDATE_LAYOUT_MUTATION, {
    variables: { id, settings: normalizeSettings(settings) },
  }).then(({ layout }) => mutateLayoutsCacheOnUpdate(layout))

// ------------------------------
// ------- CREATE LAYOUT --------
// ------------------------------

const CREATE_LAYOUT_MUTATION = newLayoutMutation('createChartConfiguration')

type LayoutCreation = Pick<Layout, 'title' | 'metrics' | 'options'> & {
  projectId: number | string
  description?: string
}

function mutateLayoutsCacheOnCreation(newLayout: Layout) {
  function updateCache(cached: QueryRecord<CurrentUserLayouts>) {
    if (!cached.currentUser) return cached

    cached.currentUser.layouts.unshift(newLayout)
    return cached
  }

  updateUserLayoutsCache(updateCache)
  updateUserShortLayoutsCache(updateCache)
  updateLayoutCache(newLayout)

  return newLayout
}

export const createUserLayout = (settings: LayoutCreation): Promise<Layout> =>
  mutate<MutatedLayoutQuery>(CREATE_LAYOUT_MUTATION, {
    variables: { settings: normalizeSettings(settings) },
  }).then(({ layout }) => mutateLayoutsCacheOnCreation(layout))

// ------------------------------
// ------- DELETE LAYOUT --------
// ------------------------------

export const DELETE_LAYOUT_MUTATION = `
  mutation ($id: ID!) {
    deleteChartConfiguration(id: $id) {
      id
    }
  }
`

function mutateLayoutsCacheOnDeletion(id: number) {
  const indexFinder = (layout: { id: number }) => +layout.id === +id
  function updateCache(cached: QueryRecord<CurrentUserLayouts>) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser
    const index = layouts.findIndex(indexFinder)

    if (index > -1) layouts.splice(index, 1)

    return cached
  }

  updateUserLayoutsCache(updateCache)
  updateUserShortLayoutsCache(updateCache)
}

export const deleteUserLayout = (id: number) =>
  mutate(DELETE_LAYOUT_MUTATION, {
    variables: { id },
  }).then(() => mutateLayoutsCacheOnDeletion(id))
