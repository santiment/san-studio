import { writable } from 'svelte/store'
import {
  queryFavoriteMetrics,
  mutateFavoriteMetrics,
} from '@/api/metrics/favorites'

let favoritesSet = new Set<string>()
const { update, subscribe, set } = writable(favoritesSet)

queryFavoriteMetrics().then((value) => set((favoritesSet = new Set(value))))

export const favoriteMetrics = {
  subscribe,
  update,
  toggle(metricKey: string) {
    const saved = new Set(favoritesSet)
    if (favoritesSet.has(metricKey)) {
      favoritesSet.delete(metricKey)
    } else {
      favoritesSet.add(metricKey)
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
