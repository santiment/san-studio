import { get, writable } from 'svelte/store'
import { track } from 'webkit/analytics'
import { Event } from '@/analytics'
import { studio } from '@/stores/studio'
import { convertBaseProjectMetric } from './utils'

export type MetricsStore = ReturnType<typeof newMetricsStore>
const getKey = ({ key }) => key

const DEFAULT = [] as Studio.Metric[]
export function newMetricsStore(defaultMetrics = DEFAULT) {
  let metrics = defaultMetrics.slice()
  let metricSet = new Set(metrics)
  const { subscribe, set } = writable(metrics)

  const update = () => set((metrics = Array.from(metricSet)))

  return {
    subscribe,
    getValue() {
      return metrics
    },
    set(newMetrics: Studio.Metric[]) {
      metricSet = new Set(newMetrics)
      update()
    },
    add(metric: Studio.Metric) {
      metricSet.add(metric)
      update()
      const asset = get(studio).slug
      track.event(Event.AddMetric, { metric: metric.key, asset })
    },
    delete(metric: Studio.Metric) {
      metricSet.delete(metric)
      update()
      const asset = get(studio).slug
      track.event(Event.RemoveMetric, { metric: metric.key, asset })
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

      track.event(Event.AddMetrics, {
        metrics: newMetrics.map(getKey) as any,
        asset: get(studio).slug,
      })
    },
    deleteEach(metrics: Studio.Metric[]) {
      metrics.forEach((metric) => metricSet.delete(metric))
      update()
    },
    hasConvertedMetric(metric: Studio.Metric, project: Studio.Project): boolean {
      const { key } = convertBaseProjectMetric(metric, project)
      return metrics.some((metric) => key === metric.key)
    },
  }
}

export function newHiddenMetricsStore(defaultMetrics: any = []) {
  const value = new Set(defaultMetrics)
  const { subscribe, set } = writable(value)

  return {
    subscribe,
    set,
    hide(metric) {
      value.add(metric)
      set(value)
    },
    show(metric) {
      value.delete(metric)
      set(value)
    },
    toggle(metric) {
      if (value.has(metric)) value.delete(metric)
      else value.add(metric)
      set(value)
    },
    has(metric) {
      return value.has(metric)
    },
  }
}
