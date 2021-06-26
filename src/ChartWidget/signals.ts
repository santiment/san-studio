import { writable } from 'svelte/store'
import { querySignalTimeseries } from '@/api/signals'
import { MetricSignal } from '@/metrics/_notables'

type MetricSettingsStore = ReturnType<typeof newMetricSignalsStore>
export type Indicators = Set<{ key: string }>
export type Signals = Studio.Metric[]

export function newMetricSignalsStore(defaultValue?: Signals) {
  let signals = (defaultValue || []) as Signals
  let signalsSet = new Set<Studio.Metric>(signals)
  const { subscribe, set } = writable(signals)

  const update = () => set((signals = Array.from(signalsSet)))

  const store = {
    subscribe,
    delete(metric: Studio.Metric) {
      signalsSet.delete(metric)
      update()
    },
    clear() {
      signalsSet.clear()
      update()
    },
    concat(newMetrics: Studio.Metric[]) {
      signalsSet = new Set(signals.concat(newMetrics))
      update()
    },
    deleteEach(metrics: Studio.Metric[]) {
      metrics.forEach((metric) => signalsSet.delete(metric))
      update()
    },
    update(metrics: Studio.Metric[]) {
      const newSignalsSet = new Set<any>()

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
  const { subscribe, set } = writable<any[]>([])

  const store = {
    subscribe,
    update(metrics: Studio.Metric[], { slug, ticker, from, to, interval }) {
      const settings = { slug, from, to, interval }
      const data = [] as any[]
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
          } as any)
          set(data)
        })
      })
    },
  }

  return store
}
