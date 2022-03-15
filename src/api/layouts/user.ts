import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { currentUserLayoutsAccessor, currentUserSortableLayoutsOptions } from './utils'
import { LAYOUT_QUERY_FIELDS } from './layout'

type CurrentUserQuery<T> = SAN.API.Query<'currentUser', null | { layouts: T[] }>

const newCurrentUserShortLayoutsCacheUpdater =
  <T extends CurrentUserQuery<unknown>>(query: string) =>
  (updateCache: SAN.API.Updater<T>) =>
    Cache.set$<T>(query, updateCache)

const newCurrentUserShortLayoutsCacheSubscriber =
  <T extends CurrentUserQuery<unknown>>(query: string) =>
  (clb: SAN.API.Subscriber<T>): SAN.API.Unsubscriber =>
    Cache.get$<T>(query, clb)

// ----------------------------------
// ------ CURRENT USER LAYOUTS ------
// ----------------------------------

export type CurrentUserLayoutsQuery = CurrentUserQuery<SAN.CurrentUserLayout>

export const USER_LAYOUTS_QUERY = `
  {
    currentUser {
			layouts: chartConfigurations{
        ${LAYOUT_QUERY_FIELDS}
			  updatedAt
				isPublic
			}
    }
  }
`
export const queryCurrentUserLayouts = (): Promise<SAN.CurrentUserLayout[]> =>
  query<CurrentUserLayoutsQuery>(USER_LAYOUTS_QUERY, currentUserSortableLayoutsOptions).then(
    currentUserLayoutsAccessor,
  )

export const updateCurrentUserLayoutsCache =
  newCurrentUserShortLayoutsCacheUpdater<CurrentUserLayoutsQuery>(USER_LAYOUTS_QUERY)
export const subscribeCurrentUserLayoutsCache =
  newCurrentUserShortLayoutsCacheSubscriber<CurrentUserLayoutsQuery>(USER_LAYOUTS_QUERY)

// ----------------------------------------
// ------ CURRENT USER SHORT LAYOUTS ------
// ----------------------------------------

export const CURRENT_USER_SHORT_LAYOUTS_QUERY = `
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

export type CurrentUserShortLayoutsQuery = CurrentUserQuery<SAN.SortedShortLayout>

export const queryCurrentUserShortLayouts = (): Promise<SAN.SortedShortLayout[]> =>
  query<CurrentUserShortLayoutsQuery>(
    CURRENT_USER_SHORT_LAYOUTS_QUERY,
    currentUserSortableLayoutsOptions,
  ).then(currentUserLayoutsAccessor)

export const updateCurrentUserShortLayoutsCache =
  newCurrentUserShortLayoutsCacheUpdater<CurrentUserShortLayoutsQuery>(
    CURRENT_USER_SHORT_LAYOUTS_QUERY,
  )
export const subscribeCurrentUserShortLayoutsCache =
  newCurrentUserShortLayoutsCacheSubscriber<CurrentUserShortLayoutsQuery>(
    CURRENT_USER_SHORT_LAYOUTS_QUERY,
  )
