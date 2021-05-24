import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricIndicatorsStore>
export type Indicators = Set<{ key: string }>
export type MetricIndicators = {
  [metricKey: string]: Indicators | undefined
}

export function newMetricIndicatorsStore(defaultValue?: MetricIndicators) {
  const MetricIndicators = (defaultValue || {}) as MetricIndicators
  const { subscribe, set } = writable(MetricIndicators)

  const store = {
    subscribe,
    new(metricKey: string) {
      return (MetricIndicators[metricKey] = new Set())
    },
    get(metricKey: string) {
      return MetricIndicators[metricKey] || store.new(metricKey)
    },
    delete(metricKey: string, indicator) {
      const metricIndicators = store.get(metricKey)
      metricIndicators.delete(indicator)
      set(MetricIndicators)
    },
    toggle(metricKey: string, indicator) {
      const metricIndicators = store.get(metricKey)

      if (metricIndicators.has(indicator)) {
        metricIndicators.delete(indicator)
      } else {
        metricIndicators.add(indicator)
      }

      set(MetricIndicators)
    },
  }

  return store
}

declare global {
  const $MetricIndicators: {}
}
