import { writable } from 'svelte/store'
const getKey = ({ key }) => key
const DEFAULT = []
export function newChartAddonsStore(defaultMetrics = DEFAULT) {
  let addons = defaultMetrics.slice()
  let addonsSet = new Set(addons)
  const { subscribe, set } = writable(addons)
  const update = () => set((addons = Array.from(addonsSet)))
  return {
    subscribe,
    getValue() {
      return addons
    },
    set(newAddons) {
      addonsSet = new Set(newAddons)
      update()
    },
    add(addon) {
      addonsSet.add(addon)
      update()
    },
    delete(addon) {
      addonsSet.delete(addon)
      update()
    },
    toggle(addon) {
      if (addonsSet.has(addon)) {
        this.delete(addon)
      } else {
        this.add(addon)
      }
    },
    concat(newAddons) {
      addonsSet = new Set(addons.concat(newAddons))
      update()
    },
  }
}
//# sourceMappingURL=contex.js.map
