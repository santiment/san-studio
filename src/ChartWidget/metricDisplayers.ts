import { writable } from 'svelte/store'
import type { addCandlesTooltipPrintable } from 'san-chart/candles'

export type ChartMetricDisplayStore = ReturnType<
  typeof newMetricDisplayersStore
>
export type MetricDisplayer = {
  formatter?: any
  axisFormatter?: any
  metricPrintablePusher?: typeof addCandlesTooltipPrintable
}
export type MetricDisplayers = {
  [metricKey: string]: MetricDisplayer | undefined
}

export function newMetricDisplayersStore() {
  let MetricDisplayers = {}
  const { subscribe, set } = writable(MetricDisplayers)

  const store = {
    subscribe,
    get(metricKey: string) {
      return MetricDisplayers[metricKey] || (MetricDisplayers[metricKey] = {})
    },
    set(metricKey: string, displays: MetricDisplayer) {
      const metricDisplayers = store.get(metricKey)
      Object.assign(metricDisplayers, displays)
      set(MetricDisplayers)
    },
    delete(metricKey: string, displayKey: string) {
      const metricDisplayers = MetricDisplayers[metricKey]
      if (metricDisplayers) {
        delete metricDisplayers[displayKey]
        set(MetricDisplayers)
      }
    },
    update(metrics: Studio.Metric[]) {
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
