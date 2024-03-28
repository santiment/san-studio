import { writable } from 'svelte/store'
import { newChartColors } from '@/Chart/colors'
import { Node } from '../nodes'

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

      referenceMetrics.forEach((metric: any) => {
        const { key } = metric
        const target = metric.project
          ? metric.key.replace(metric.base.key, metric.references)
          : metric.references

        _colors[key] = _colors[target]
      })

      set((colors = _colors))
    },
    replace(oldMetricKey: string, newMetricKey: string) {
      colors[newMetricKey] = colors[oldMetricKey]
      set(colors)
    },
  }
}
