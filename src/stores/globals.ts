import { writable } from 'svelte/store'

const GLOBALS = {
  isPro: false,
  isProPlus: false,
  isTrial: false,
  isNightMode: false,
  isLoggedIn: false,
  isBeta: false,
  isPresenterMode: false,
  isNewDrawing: false,
}

const { subscribe, set } = writable(GLOBALS)
export const globals = {
  subscribe,
  set,
  toggle(name: keyof typeof GLOBALS, value?: boolean): void {
    GLOBALS[name] = value === undefined ? !GLOBALS[name] : value
    set(GLOBALS)
  },
}
