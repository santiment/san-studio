import { writable } from 'svelte/store'
import { newChartColors } from '@/Chart/colors'

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
      set((colors = newChartColors(metrics, colors)))
    },
    replace(oldMetricKey: string, newMetricKey: string) {
      colors[newMetricKey] = colors[oldMetricKey]
      set(colors)
    },
  }
}
