import { writable } from 'svelte/store'

const GLOBALS = {
  isPro: false,
  isProPlus: false,
  isNightMode: false,
  isLoggedIn: false,
  isBeta: false,
  isPresenterMode: false,
}

const { subscribe, set } = writable(GLOBALS)
export const globals = {
  subscribe,
  set,
  toggle(name: keyof typeof GLOBALS, value?: boolean) {
    GLOBALS[name] = value === undefined ? !GLOBALS[name] : value
    set(GLOBALS)
  },
}
