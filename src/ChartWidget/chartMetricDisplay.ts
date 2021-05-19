import { writable } from 'svelte/store'
import type { addCandlesTooltipPrintable } from 'san-chart/candles'

export type ChartMetricDisplayStore = ReturnType<typeof newChartDisplayStore>
export type ChartMetricDisplay = {
  formatter?: any
  axisFormatter?: any
  metricPrintablePusher?: typeof addCandlesTooltipPrintable
}
export type ChartMetricDisplays = {
  [metricKey: string]: ChartMetricDisplay | undefined
}

export function newChartDisplayStore() {
  let ChartMetricDisplays = {}
  const { subscribe, set } = writable(ChartMetricDisplays)

  const store = {
    subscribe,
    get(metricKey: string) {
      return (
        ChartMetricDisplays[metricKey] || (ChartMetricDisplays[metricKey] = {})
      )
    },
    set(metricKey: string, displays: ChartMetricDisplay) {
      const metricDisplays = store.get(metricKey)
      Object.assign(metricDisplays, displays)
      set(ChartMetricDisplays)
    },
    delete(metricKey: string, displayKey: string) {
      const metricDisplays = ChartMetricDisplays[metricKey]
      if (metricDisplays) {
        delete metricDisplays[displayKey]
        set(ChartMetricDisplays)
      }
    },
    update(metrics: Studio.Metric[]) {
      const NewMetricDisplays = {}
      metrics.forEach((metric) => {
        const metricDisplayes = ChartMetricDisplays[metric.key] || {}
        NewMetricDisplays[metric.key] = metricDisplayes
      })

      set((ChartMetricDisplays = NewMetricDisplays))
    },
  }

  return store
}
