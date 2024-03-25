import { writable } from 'svelte/store'

export function createMinimizedEmbed() {
  const store = writable({ minimized: false, controls: false })

  /*
  if (false && process.browser) {
    checkSize()

    function checkSize() {
      if (window.innerHeight < 300) {
        store.update((v) => ({ ...v, controls: true, minimized: true }))
      } else {
        store.update((v) => ({ ...v, controls: false, minimized: false }))
      }
    }
  }
  */

  return {
    ...store,
    toggle() {
      store.update((v) => ({ ...v, minimized: !v.minimized }))
    },
  }
}

export const minimized$ = createMinimizedEmbed()
