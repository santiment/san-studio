import { writable } from 'svelte/store'
import { logScale, linearScale } from 'san-chart/scales'
import { track } from 'webkit/analytics'
import { getSavedBoolean, saveBoolean } from 'webkit/utils/localStorage'
import { Event } from '@/analytics'

const SaveOption = {
  cartesianGrid: (value) => saveBoolean('isCartesianGridActive', value),
  watermark: (value) => saveBoolean('isWatermarkVisible', value),
  isWatermarkLessVisible: (value) => saveBoolean('isWatermarkLighter', value),
}

const OPTIONS = {
  scale: linearScale,
  isLogScale: false,
  cartesianGrid: getSavedBoolean('isCartesianGridActive', true),
  watermark: true,
  isWatermarkLessVisible: false,
}

type ChartOptions = typeof OPTIONS
type ChartOptionsStore = ReturnType<typeof newChartOptionsStore>

export function newChartOptionsStore({
  isCartesianGrid,
  isWatermarkHidden,
}: any = OPTIONS) {
  const options = Object.assign({}, OPTIONS)
  if (isCartesianGrid !== undefined) options.cartesianGrid = isCartesianGrid
  if (isWatermarkHidden !== undefined) options.watermark = !isWatermarkHidden

  const { subscribe, set } = writable(options)

  const store = {
    subscribe,
    set,
    toggleScale() {
      const isLogScale = options.scale === logScale
      options.scale = isLogScale ? linearScale : logScale
      options.isLogScale = !isLogScale

      set(options)
      track.event(Event.Scale, { type: isLogScale ? 'linear' : 'log' })
    },
    toggle(option: string) {
      const value = !options[option]
      options[option] = value
      set(options)
      SaveOption[option]?.(value)
    },
    getProDefaults(isPro, isProPlus) {
      if (isProPlus)
        options.watermark = getSavedBoolean('isWatermarkVisible', true)

      if (isPro || isProPlus) {
        options.isWatermarkLessVisible = getSavedBoolean(
          'isWatermarkLighter',
          false,
        )

        set(options)
      }
    },
  }
  return store
}

declare global {
  const $chartOptions: ChartOptions
}
