import { writable } from 'svelte/store'
import { newChartColors } from '@/Chart/colors'
import { Node } from '../nodes'
import { newProjectMetricKey } from '@/metrics/utils'

export type ChartColorsStore = ReturnType<typeof newChartColorsStore>
export type ChartColors = {
  [metricKey: string]: string
}

export function newChartColorsStore(defaultValue?: ChartColors) {
  let colors = Object.assign({}, defaultValue)
  const { subscribe, set } = writable<ChartColors>(colors)

  const get = () => colors
  return {
    subscribe,
    get,
    set(metricKey: string, color: string) {
      colors[metricKey] = color
      set((colors = { ...colors }))
    },
    update(metrics: Studio.Metric[]) {
      const referenceMetrics = new Set()

      const _colors = newChartColors(
        metrics.filter((metric) => {
          if (metric.node !== Node.REFERENCE) return true

          referenceMetrics.add(metric)
        }),

        colors,
      )

      referenceMetrics.forEach((metric) => {
        const { key } = metric
        let referencesKey = metric.references

        if (metric.project) {
          referencesKey = newProjectMetricKey(metric.project, { key: referencesKey })
        }

        _colors[key] = _colors[referencesKey]
      })

      set(_colors)
    },
    replace(oldMetricKey: string, newMetricKey: string) {
      colors[newMetricKey] = colors[oldMetricKey]
      set(colors)
    },
  }
}
