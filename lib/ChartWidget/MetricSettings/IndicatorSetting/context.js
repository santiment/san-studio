import { writable } from 'svelte/store'
export function newMetricIndicatorsStore(defaultValue) {
  let MetricIndicators = defaultValue || {}
  const { subscribe, set } = writable(MetricIndicators)
  const store = {
    subscribe,
    new(metricKey) {
      return (MetricIndicators[metricKey] = new Set())
    },
    get(metricKey) {
      return MetricIndicators[metricKey] || store.new(metricKey)
    },
    delete(metricKey, indicator) {
      const metricIndicators = store.get(metricKey)
      metricIndicators.delete(indicator)
      set(MetricIndicators)
    },
    toggle(metricKey, indicator) {
      const metricIndicators = store.get(metricKey)
      if (metricIndicators.has(indicator)) {
        metricIndicators.delete(indicator)
      } else {
        metricIndicators.add(indicator)
      }
      set(MetricIndicators)
    },
    update(metrics) {
      const NewMetricIndicators = {}
      metrics.forEach((metric) => {
        if (!metric.indicator) return
        const { base, indicator } = metric
        const { key } = base
        if (!NewMetricIndicators[key]) NewMetricIndicators[key] = new Set()
        NewMetricIndicators[key].add(indicator)
      })
      set((MetricIndicators = NewMetricIndicators))
    },
  }
  return store
}
//# sourceMappingURL=context.js.map
