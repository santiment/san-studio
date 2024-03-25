import { writable } from 'svelte/store'

export function createMinimizedEmbed(isEmbedded = false) {
  const store = writable({ minimized: false })

  if ((true || isEmbedded) && process.browser) {
    checkSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', console.log)

    function checkSize({ width, height }: { width: number; height: number }) {
      console.log(width, height, height < 300)
      if (height < 300) {
        store.update((v) => ({ ...v, minimized: true }))
      }
    }
  }

  return {
    ...store,
    toggle() {
      store.update((v) => ({ ...v, minimized: !v.minimized }))
    },
  }
}

export const minimized$ = createMinimizedEmbed(process.browser ? window !== window.parent : false)
