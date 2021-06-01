import { writable } from 'svelte/store'
import { querySignalTimeseries } from '@/api/signals'
import { MetricSignal } from '@/metrics/_notables'

type MetricSettingsStore = ReturnType<typeof newMetricSignalsStore>
export type Indicators = Set<{ key: string }>
export type Signals = string[]

export function newMetricSignalsStore(defaultValue?: Signals) {
  let signals = (defaultValue || []) as Signals
  let signalsSet = new Set<Studio.Metric>()
  const { subscribe, set } = writable(signals)

  const update = () => set((signals = Array.from(signalsSet)))

  const store = {
    subscribe,
    add(metricKey: string) {
      signalsSet.add(metricKey)
      update()
    },
    concat(newMetrics: Studio.Metric[]) {
      signalsSet = new Set(signals.concat(newMetrics))
      update()
    },
    update(metrics: Studio.Metric[]) {
      const newSignalsSet = new Set()

      metrics.forEach(
        (metric) => signalsSet.has(metric) && newSignalsSet.add(metric),
      )

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
    update(metrics: Studio.Metric[], { slug, ticker, from, to, interval }) {
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
