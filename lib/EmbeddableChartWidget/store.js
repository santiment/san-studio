import { writable } from 'svelte/store';
export function createMinimizedEmbed() {
    const store = writable({ minimized: false, controls: false });
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
    return Object.assign(Object.assign({}, store), { toggle() {
            store.update((v) => (Object.assign(Object.assign({}, v), { minimized: !v.minimized })));
        } });
}
export const minimized$ = createMinimizedEmbed();
//# sourceMappingURL=store.js.map