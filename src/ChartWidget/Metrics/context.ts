import { writable } from 'svelte/store'
import { convertBaseProjectMetric } from './utilts'

export type MetricsStore = ReturnType<typeof newMetricsStore>

const DEFAULT = [] as Studio.Metric[]
export function newMetricsStore(defaultMetrics = DEFAULT) {
  let metrics = defaultMetrics.slice()
  let metricSet = new Set(metrics)
  const { subscribe, set } = writable(metrics)

  const update = () => set((metrics = Array.from(metricSet)))

  return {
    subscribe,
    add(metric: Studio.Metric) {
      metricSet.add(metric)
      update()
    },
    delete(metric: Studio.Metric) {
      metricSet.delete(metric)
      update()
    },
    toggle(metric: Studio.Metric) {
      if (metricSet.has(metric)) {
        this.delete(metric)
      } else {
        this.add(metric)
      }
    },
    replace(index: number, newMetric: Studio.Metric) {
      metrics[index] = newMetric
      metricSet = new Set(metrics)
      set(metrics)
    },
    concat(newMetrics: Studio.Metric[]) {
      metricSet = new Set(metrics.concat(newMetrics))
      update()
    },
    hasConvertedMetric(
      metric: Studio.Metric,
      project: Studio.Project,
    ): boolean {
      const { key } = convertBaseProjectMetric(metric, project)
      return metrics.some((metric) => key === metric.key)
    },
  }
}
