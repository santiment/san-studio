import { writable } from 'svelte/store'

export type ChartAxesStore = ReturnType<typeof newChartAxesStore>
export function newChartAxesStore(
  defaultEnabled?: Set<Studio.Metric>,
  defaultDisabled?: Set<Studio.Metric>,
) {
  let MetricPosition = {} as { [metricKey: string]: number }
  let enabled = new Set<Studio.Metric>(defaultEnabled)
  const disabled = new Set<Studio.Metric>(defaultDisabled)
  const { subscribe, set } = writable<Set<Studio.Metric>>(enabled)

  return {
    subscribe,
    delete(metric: Studio.Metric): void {
      disabled.delete(metric)
    },
    toggle(metric: Studio.Metric): void {
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
    ): void {
      MetricPosition = {}
      enabled = new Set<Studio.Metric>()
      const { length } = metrics

      for (let i = 0; i < length; i++) {
        const metric = metrics[i]
        MetricPosition[metric.key] = i
        if (disabled.has(metric) || exceptionsMap.has(metric)) continue
        if (enabled.add(metric).size >= 3) break
      }

      set(enabled)
    },
  }
}
