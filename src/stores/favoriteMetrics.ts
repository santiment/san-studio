import { writable } from 'svelte/store'
import { track } from 'webkit/analytics'
import { queryFavoriteMetrics, mutateFavoriteMetrics } from '@/api/metrics/favorites'
import { Event } from '@/analytics'

let favoritesSet = new Set<string>()
const { update, subscribe, set } = writable(favoritesSet)

if (process.browser) queryFavoriteMetrics().then((value) => set((favoritesSet = new Set(value))))

export const favoriteMetrics = {
  subscribe,
  update,
  toggle(metricKey: string) {
    const saved = new Set(favoritesSet)
    if (favoritesSet.has(metricKey)) {
      favoritesSet.delete(metricKey)
      track.event(Event.UnfavoriteMetric, { metric: metricKey })
    } else {
      favoritesSet.add(metricKey)
      track.event(Event.FavoriteMetric, { metric: metricKey })
    }
    set(favoritesSet)

    mutateFavoriteMetrics(Array.from(favoritesSet)).catch(() => {
      favoritesSet = saved
      set(saved)
    })
  },
}

declare global {
  const $favoriteMetrics: Set<string>
}
