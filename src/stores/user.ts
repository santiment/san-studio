import type { CurrentUser } from 'webkit/api/analytics'
import { writable } from 'svelte/store'
import { queryCurrentUser } from 'webkit/api/analytics'

const { subscribe, set } = writable<CurrentUser>(null)
let wasNotFetched = true

export const currentUser = {
  set,
  subscribe(run, invalidate) {
    if (wasNotFetched) {
      wasNotFetched = false
      queryCurrentUser().then(set)
    }

    return subscribe(run, invalidate)
  },
} as { subscribe: typeof subscribe }
