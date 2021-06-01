import { setContext, getContext } from 'svelte'
import { get, writable } from 'svelte/store'
import { CachePolicy } from 'webkit/api/cache'
import { getTodaysEnd } from 'webkit/utils/dates'
import { studio } from './studio'

export const CONTEXT = 'AUTO_UPDATER'
export const setAutoUpdater = (store): void => setContext(CONTEXT, store)
export const getAutoUpdater = () => getContext(CONTEXT)

export function newAutoUpdaterStore(Widgets) {
  const state = { isUpdating: false, lastUpdate: Date.now() }
  const { subscribe, set } = writable(state)

  let autoTimer: number

  const store = {
    subscribe,
    check({ to }) {
      if (to === getTodaysEnd().toISOString()) return store.update(true)

      window.clearTimeout(autoTimer)
      state.isUpdating = false
      state.lastUpdate = Date.now()
      set(state)
    },
    enable() {
      studio.setPeriod(new Date(get(studio).from), getTodaysEnd())
      store.update()
    },
    update(refetch = true) {
      window.clearTimeout(autoTimer)

      if (refetch) {
        get(Widgets).forEach((widget) => {
          widget.fetchData?.(CachePolicy.NewCache)
        })
      }

      state.isUpdating = true
      state.lastUpdate = Date.now()

      // NOTE: Auto updating every 5 mins [@vanguard | Jun  1, 2021]
      autoTimer = window.setTimeout(store.update, 300 * 1000)
      set(state)
    },
  }

  setAutoUpdater(store)
  return store
}
