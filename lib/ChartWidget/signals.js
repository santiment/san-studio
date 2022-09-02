import { writable } from 'svelte/store'
import { querySignalTimeseries } from './../../lib/api/signals'
import { MetricSignal } from './../../lib/metrics/_notables'
export function newMetricSignalsStore(defaultValue) {
  let signals = defaultValue || []
  let signalsSet = new Set(signals)
  const { subscribe, set } = writable(signals)
  const update = () => set((signals = Array.from(signalsSet)))
  const store = {
    subscribe,
    set(newMetrics) {
      signalsSet = new Set(newMetrics)
      update()
    },
    add(metric) {
      signalsSet.add(metric)
      update()
    },
    delete(metric) {
      signalsSet.delete(metric)
      update()
    },
    clear() {
      signalsSet.clear()
      update()
    },
    concat(newMetrics) {
      signalsSet = new Set(signals.concat(newMetrics))
      update()
    },
    deleteEach(metrics) {
      metrics.forEach((metric) => signalsSet.delete(metric))
      update()
    },
    update(metrics) {
      const newSignalsSet = new Set()
      metrics.forEach((metric) => signalsSet.has(metric) && newSignalsSet.add(metric))
      signalsSet = newSignalsSet
      update()
    },
  }
  return store
}
export function newSignalsTimeseriesStore() {
  const { subscribe, set } = writable([])
  const store = {
    subscribe,
    update(metrics, { slug, ticker, from, to, interval }) {
      const settings = { slug, from, to, interval }
      const data = []
      set(data)
      metrics.forEach((metric) => {
        const { key } = metric
        const signal = MetricSignal[key]
        if (!signal) return
        querySignalTimeseries(signal.key, settings).then((signals) => {
          data.push({
            key: signal.key,
            metric: key,
            data: signals,
            formatter: signal.formatter,
            label: `${metric.label} (${ticker})`,
          })
          set(data)
        })
      })
    },
  }
  return store
}
//# sourceMappingURL=signals.js.map
