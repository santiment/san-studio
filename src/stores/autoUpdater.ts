import { get, writable } from 'svelte/store'
import { CachePolicy } from 'webkit/api/cache'
import { getTodaysEnd } from 'webkit/utils/dates'
import { getStudioContext, setStudioContext } from '@/context'
import { studio } from './studio'

export const CONTEXT = 'AUTO_UPDATER'
export const setAutoUpdater = (store): void => setStudioContext(CONTEXT, store)
export const getAutoUpdater = () => getStudioContext(CONTEXT)

export function newAutoUpdaterStore(Widgets: any) {
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
    enable(changePeriod) {
      changePeriod(get(studio).from, getTodaysEnd())
      store.update()
    },
    update(refetch = true) {
      window.clearTimeout(autoTimer)

      if (refetch) {
        const widgets = Array.isArray(Widgets) ? Widgets : get<any>(Widgets)
        widgets.forEach((widget) => {
          if (widget.isHidden) {
            widget.defferedCachePolicy = CachePolicy.NewCache
            return
          }
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
