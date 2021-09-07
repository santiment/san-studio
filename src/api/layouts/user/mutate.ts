import type { Query, QueryRecord } from 'webkit/api'
import type { Layout } from './index'
import type { UserLayoutsTemplate } from '../index'
import { mutate } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { USER_LAYOUTS_QUERY } from './index'
import { USER_LAYOUTS_QUERY as SIDEBAR_USER_LAYOUTS_QUERY } from '../index'
import { dateSorter } from '../utils'

// ------------------------------
// ------- UPDATE LAYOUT --------
// ------------------------------

const UPDATE_LAYOUT_MUTATION = `
  mutation updateChartConfiguration(
    $id: ID!
    $settings: ProjectChartInputObject!
  ) {
    updateChartConfiguration(id: $id, settings: $settings) {
      id
    }
  }
`

type LayoutUpdates = Partial<
  Pick<Layout, 'title' | 'metrics' | 'options' | 'isPublic'>
>

function mutateLayoutsCacheOnUpdate(id: number, settings: LayoutUpdates) {
  ;(settings as any).updatedAt = new Date().toISOString()
  const updateLayout = (layout: Pick<Layout, 'id'>) =>
    +layout.id === +id && Object.assign(layout, settings)

  function updateCache(cached: QueryRecord<UserLayoutsTemplate>) {
    if (!cached.currentUser) return cached

    const { layouts } = cached.currentUser

    layouts.some(updateLayout)
    layouts.sort(dateSorter)

    return cached
  }

  Cache.set$<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, updateCache)
  Cache.set$<UserLayoutsTemplate>(SIDEBAR_USER_LAYOUTS_QUERY, updateCache)
}

export const updateUserLayout = (id: number, settings: LayoutUpdates) =>
  mutate(UPDATE_LAYOUT_MUTATION, {
    variables: { id, settings },
  }).then(() => mutateLayoutsCacheOnUpdate(id, settings))

// ------------------------------
// ------- CREATE LAYOUT --------
// ------------------------------

const CREATE_LAYOUT_MUTATION = `
  mutation createChartConfiguration(
    $settings: ProjectChartInputObject!
  ) {
    createChartConfiguration(settings: $settings) {
      id
			isPublic
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

type CreatedLayout = { id: number }
type CreatedLayoutQuery = Query<'currentUser', CreatedLayout>

type LayoutCreation = Pick<Layout, 'title' | 'metrics' | 'options'> & {
  projectId: number
  description?: string
}

function mutateLayoutsCacheOnCreation(newLayout: any, settings: LayoutUpdates) {
  const layout = Object.assign(newLayout, settings, {
    updatedAt: new Date().toISOString(),
  })

  function updateCache(cached: QueryRecord<UserLayoutsTemplate>) {
    if (!cached.currentUser) return cached

    cached.currentUser.layouts.unshift(layout)
    return cached
  }

  Cache.set$<UserLayoutsTemplate>(USER_LAYOUTS_QUERY, updateCache)
  Cache.set$<UserLayoutsTemplate>(SIDEBAR_USER_LAYOUTS_QUERY, updateCache)
}

export const createUserLayout = (
  settings: LayoutCreation,
): Promise<CreatedLayout> =>
  mutate<CreatedLayoutQuery>(CREATE_LAYOUT_MUTATION, {
    variables: { settings },
  }).then(
    ({ currentUser }) => (
      mutateLayoutsCacheOnCreation(currentUser, settings), currentUser
    ),
  )
