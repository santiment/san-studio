import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricIndicatorsStore>
export type Indicators = Set<{ key: string }>
type MetricIndicators = {
  [metricKey: string]: Indicators | undefined
}

export const CONTEXT = 'MetricIndicators'
const setMetricIndicators = (chart: MetricSettingsStore): void =>
  setContext(CONTEXT, chart)
export const getMetricIndicators = (): MetricSettingsStore =>
  getContext(CONTEXT)

export function newMetricIndicatorsStore() {
  const MetricIndicators = {} as MetricIndicators
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

  setMetricIndicators(store)
  return store
}

declare global {
  const $MetricIndicators: {}
}
