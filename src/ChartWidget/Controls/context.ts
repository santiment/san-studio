import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
import { logScale, linearScale } from 'san-chart/scales'

const OPTIONS = {
  scale: linearScale,
  cartesianGrid: false,
  watermark: true,
  isLogScale: false,
  isWatermarkLessVisible: false,
}
type ChartOptions = typeof OPTIONS
type ChartOptionsStore = ReturnType<typeof newChartOptionsStore>

const CONTEXT = 'chartOptions'
export const setChartOptions = (chart: ChartOptionsStore): void =>
  setContext(CONTEXT, chart)
export const getChartOptions = (): ChartOptionsStore => getContext(CONTEXT)

export function newChartOptionsStore() {
  const options = Object.assign({}, OPTIONS)
  const { subscribe, set } = writable(options)

  const store = {
    subscribe,
    set,
    toggleScale() {
      const isLogScale = options.scale === logScale
      options.scale = isLogScale ? linearScale : logScale
      options.isLogScale = !isLogScale
      set(options)
    },
    toggle(option: string) {
      options[option] = !options[option]
      set(options)
    },
  }

  setChartOptions(store)
  return store
}

declare global {
  const $chartOptions: ChartOptions
}
