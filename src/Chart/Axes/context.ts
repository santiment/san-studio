import { writable } from 'svelte/store'

export type ChartAxesStore = ReturnType<typeof newChartAxesStore>
export function newChartAxesStore(
  defaultEnabled?: Set<Studio.Metric>,
  defaultDisabled?: Set<Studio.Metric>,
) {
  let MetricPosition = {} as { [metricKey: string]: number }
  let shared = new Set<string>()
  let enabled = new Set<Studio.Metric>(defaultEnabled)
  const disabled = new Set<Studio.Metric>(defaultDisabled)
  const { subscribe, set } = writable<Set<Studio.Metric>>(enabled)

  return {
    subscribe,
    delete(metric: Studio.Metric): void {
      disabled.delete(metric)
    },
    toggle(metric: Studio.Metric): void {
      if (shared.has(metric.key)) return

      if (enabled.has(metric)) {
        enabled.delete(metric)
        disabled.add(metric)
      } else {
        const metrics = Array.from(enabled)
        metrics.splice(MetricPosition[metric.key], 0, metric)
        enabled = new Set(metrics)
        disabled.delete(metric)
      }
      set(enabled)
    },
    updateMetrics(
      metrics: Studio.Metric[],
      exceptionsMap: Map<Studio.Metric, string>,
      domainGroups: string[][] = [],
    ): void {
      MetricPosition = {}
      const newEnabled = new Set<Studio.Metric>()
      let sharedAxes: string[] = []

      for (let i = 0, len = domainGroups.length; i < len; i++) {
        sharedAxes = sharedAxes.concat(domainGroups[i].slice(1))
      }

      shared = new Set(sharedAxes)
      const { length } = metrics
      for (let i = 0; i < length; i++) {
        const metric = metrics[i]
        MetricPosition[metric.key] = i
        // prettier-ignore
        if (disabled.has(metric) || exceptionsMap.has(metric) || shared.has(metric.key)) continue
        if (enabled.has(metric) || newEnabled.size < 3) newEnabled.add(metric)
      }

      set((enabled = newEnabled))
    },
  }
}

export function newPinnedChartAxesStore(defaults?: Set<Studio.Metric>) {
  const pinned = new Set(defaults)
  const { subscribe, set } = writable<Set<Studio.Metric>>(pinned)

  return {
    subscribe,
    has(metric) {
      return pinned.has(metric)
    },
    toggle(metric) {
      if (this.has(metric)) this.delete(metric)
      else this.add(metric)
    },
    add(metric) {
      pinned.add(metric)
      set(pinned)
    },
    delete(metric) {
      pinned.delete(metric)
      set(pinned)
    },
  }
}
