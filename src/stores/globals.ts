import { writable } from 'svelte/store'

const GLOBALS = {
  isPro: false,
  isProPlus: false,
  isNightMode: false,
  isLoggedIn: false,
  isBeta: false,
}

const { subscribe, set } = writable(GLOBALS)
export const globals = {
  subscribe,
  set,
  toggle(name: keyof typeof GLOBALS, value: boolean) {
    GLOBALS[name] = value
    set(GLOBALS)
  },
}
