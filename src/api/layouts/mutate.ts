import type { Query } from 'webkit/api'
import type { Layout } from './layout'
import type {
  CurrentUserLayout,
  CurrentUserLayoutsQuery,
  CurrentUserShortLayoutsQuery,
} from './user'
import { mutate } from 'webkit/api'
import {
  updateCurrentUserLayoutsCache,
  updateCurrentUserShortLayoutsCache,
} from './user'
import { LAYOUT_QUERY_FIELDS, updateLayoutCache } from './layout'
import { dateSorter } from './utils'

type MutatedLayoutQuery = Query<'layout', CurrentUserLayout>
type CurrentUserLayouts = CurrentUserLayoutsQuery & CurrentUserShortLayoutsQuery

type LayoutUpdates = Partial<Pick<Layout, 'title' | 'metrics' | 'options'>> & {
  isPublic?: boolean
  projectId?: number | string
  description?: string
}

const newLayoutMutation = (mutation: string, argTypes = '', args = '') => `
  mutation(
    $settings: ProjectChartInputObject! ${argTypes}
  ) {
    layout:${mutation}(settings: $settings${args}) {
      ${LAYOUT_QUERY_FIELDS}
      isPublic
      updatedAt
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
      variables.options = JSON.stringify(options) as any
    }
  }

  return variables
}

// ------------------------------
// ------- UPDATE LAYOUT --------
// ------------------------------

const UPDATE_LAYOUT_MUTATION = newLayoutMutation(
  'updateChartConfiguration',
  '$id: ID!',
  ',id: $id',
)

function mutateLayoutsCacheOnUpdate(newLayout: CurrentUserLayout) {
  const id = +newLayout.id
  const updateLayout = (cachedLayout: Pick<Layout, 'id'>) =>
    +cachedLayout.id === id && Object.assign(cachedLayout, newLayout)

  function updateCache(cached: CurrentUserLayouts) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser

    layouts.some(updateLayout)
    layouts.sort(dateSorter)

    return cached
  }

  updateCurrentUserLayoutsCache(updateCache)
  updateCurrentUserShortLayoutsCache(updateCache)
  updateLayoutCache(newLayout)

  return newLayout
}

export const updateUserLayout = (
  id: number,
  settings: LayoutUpdates,
): Promise<CurrentUserLayout> =>
  mutate<MutatedLayoutQuery>(UPDATE_LAYOUT_MUTATION, {
    variables: { id, settings: normalizeSettings(settings) },
  }).then(({ layout }) => mutateLayoutsCacheOnUpdate(layout))

// ------------------------------
// ------- CREATE LAYOUT --------
// ------------------------------

const CREATE_LAYOUT_MUTATION = newLayoutMutation('createChartConfiguration')

type LayoutCreation = Pick<Layout, 'title' | 'metrics' | 'options'> & {
  projectId: number | string
  isPublic?: boolean
  description?: string
}

function mutateLayoutsCacheOnCreation(newLayout: CurrentUserLayout) {
  function updateCache(cached: CurrentUserLayouts) {
    if (!cached.currentUser) return cached

    cached.currentUser.layouts.unshift(newLayout)
    return cached
  }

  updateCurrentUserLayoutsCache(updateCache)
  updateCurrentUserShortLayoutsCache(updateCache)
  updateLayoutCache(newLayout)

  return newLayout
}

export const createUserLayout = (
  settings: LayoutCreation,
): Promise<CurrentUserLayout> =>
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
  function updateCache(cached: CurrentUserLayouts) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser
    const index = layouts.findIndex(indexFinder)

    if (index > -1) layouts.splice(index, 1)

    return cached
  }

  updateCurrentUserLayoutsCache(updateCache)
  updateCurrentUserShortLayoutsCache(updateCache)
}

export const deleteUserLayout = (id: number) =>
  mutate(DELETE_LAYOUT_MUTATION, {
    variables: { id },
  }).then(() => mutateLayoutsCacheOnDeletion(id))
