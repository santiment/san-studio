import { writable } from 'svelte/store'
export function newMetricDisplayersStore() {
  let MetricDisplayers = {}
  const { subscribe, set } = writable(MetricDisplayers)
  const store = {
    subscribe,
    get(metricKey) {
      return MetricDisplayers[metricKey] || (MetricDisplayers[metricKey] = {})
    },
    set(metricKey, displays) {
      const metricDisplayers = store.get(metricKey)
      Object.assign(metricDisplayers, displays)
      set(MetricDisplayers)
    },
    delete(metricKey, displayKey) {
      const metricDisplayers = MetricDisplayers[metricKey]
      if (metricDisplayers) {
        delete metricDisplayers[displayKey]
        set(MetricDisplayers)
      }
    },
    update(metrics) {
      const NewMetricDisplayers = {}
      metrics.forEach((metric) => {
        const metricDisplayes = MetricDisplayers[metric.key] || {}
        NewMetricDisplayers[metric.key] = metricDisplayes
      })
      set((MetricDisplayers = NewMetricDisplayers))
    },
  }
  return store
}
//# sourceMappingURL=metricDisplayers.js.map
