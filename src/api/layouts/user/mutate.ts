import type { QueryRecord } from 'webkit/api'
import type { Layout } from './index'
import type { UserLayoutsTemplate } from '../index'
import { mutate } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { USER_LAYOUTS_QUERY } from './index'
import { USER_LAYOUTS_QUERY as SIDEBAR_USER_LAYOUTS_QUERY } from '../index'
import { dateSorter } from '../utils'

const UPDATE_TEMPLATE_MUTATION = `
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

function updateLayoutsCache(id: number, settings: LayoutUpdates) {
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
  mutate(UPDATE_TEMPLATE_MUTATION, {
    variables: { id, settings },
  }).then(() => updateLayoutsCache(id, settings))
