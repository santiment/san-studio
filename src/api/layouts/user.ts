import type { Query } from 'webkit/api'
import type { Updater, Subscriber, Unsubscriber } from 'webkit/api/cache'
import type { Layout, ShortLayout } from './layout'
import type { SortedShortLayout } from './layouts'
import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import {
  currentUserLayoutsAccessor,
  currentUserSortableLayoutsOptions,
} from './utils'
import { LAYOUT_QUERY_FIELDS } from './layout'

type CurrentUserQuery<T> = Query<'currentUser', null | { layouts: T[] }>

const newCurrentUserShortLayoutsCacheUpdater =
  <T extends CurrentUserQuery<unknown>>(query: string) =>
  (updateCache: Updater<T>) =>
    Cache.set$<T>(query, updateCache)

const newCurrentUserShortLayoutsCacheSubscriber =
  <T extends CurrentUserQuery<unknown>>(query: string) =>
  (clb: Subscriber<T>): Unsubscriber =>
    Cache.get$<T>(query, clb)

// ----------------------------------
// ------ CURRENT USER LAYOUTS ------
// ----------------------------------

export type CurrentUserLayout = Layout &
  SortedShortLayout & { isPublic: boolean }
export type CurrentUserLayoutsQuery = CurrentUserQuery<CurrentUserLayout>

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
export const queryCurrentUserLayouts = (): Promise<CurrentUserLayout[]> =>
  query<CurrentUserLayoutsQuery>(
    USER_LAYOUTS_QUERY,
    currentUserSortableLayoutsOptions,
  ).then(currentUserLayoutsAccessor)

export const updateCurrentUserLayoutsCache =
  newCurrentUserShortLayoutsCacheUpdater<CurrentUserLayoutsQuery>(
    USER_LAYOUTS_QUERY,
  )
export const subscribeCurrentUserLayoutsCache =
  newCurrentUserShortLayoutsCacheSubscriber<CurrentUserLayoutsQuery>(
    USER_LAYOUTS_QUERY,
  )

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

export type CurrentUserShortLayoutsQuery = CurrentUserQuery<SortedShortLayout>

export const queryCurrentUserShortLayouts = (): Promise<SortedShortLayout[]> =>
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
