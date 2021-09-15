import { get, writable } from 'svelte/store'

export type MetricsStore = ReturnType<typeof newChartAddonsStore>
const getKey = ({ key }) => key

const DEFAULT = [] as any[]
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
    set(newAddons: Studio.Metric[]) {
      addonsSet = new Set(newAddons)
      update()
    },
    add(addon: Studio.Metric) {
      addonsSet.add(addon)
      update()
    },
    delete(addon: Studio.Metric) {
      addonsSet.delete(addon)
      update()
    },
    toggle(addon: Studio.Metric) {
      if (addonsSet.has(addon)) {
        this.delete(addon)
      } else {
        this.add(addon)
      }
    },
    concat(newAddons: Studio.Metric[]) {
      addonsSet = new Set(addons.concat(newAddons))
      update()
    },
  }
}
