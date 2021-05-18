import { writable } from 'svelte/store'
import { setContext, getContext } from 'svelte'
import { newChartColors } from '@/Chart/colors'

const CONTEXT = 'ChartColors'
export const setChartColors = (store): void => setContext(CONTEXT, store)
export const getChartColors = () => getContext(CONTEXT)

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
      set(colors)
    },
    update(metrics: Studio.Metric[]) {
      set((colors = newChartColors(metrics, colors)))
    },
  }
}
