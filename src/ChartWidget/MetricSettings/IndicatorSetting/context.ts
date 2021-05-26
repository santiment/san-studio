import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricIndicatorsStore>
export type Indicators = Set<{ key: string }>
export type MetricIndicators = {
  [metricKey: string]: Indicators | undefined
}

export function newMetricIndicatorsStore(defaultValue?: MetricIndicators) {
  let MetricIndicators = (defaultValue || {}) as MetricIndicators
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
    update(metrics: Studio.Metric[]) {
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

declare global {
  const $MetricIndicators: {}
}
