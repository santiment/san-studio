import { writable } from 'svelte/store'
import { logScale, linearScale } from 'san-chart/scales'
import { track } from 'webkit/analytics'
import { Event } from '@/analytics'
import { getSavedValue, saveValue } from '@/utils/localStorage'

const SaveOption = {
  cartesianGrid: (value) => saveValue('isCartesianGridActive', value || ''),
  watermark: (value) => saveValue('isWatermarkVisible', value || ''),
  isWatermarkLessVisible: (value) =>
    saveValue('isWatermarkLighter', value || ''),
}

const OPTIONS = {
  scale: linearScale,
  isLogScale: false,
  cartesianGrid: !!getSavedValue('isCartesianGridActive', true),
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
        options.watermark = !!getSavedValue('isWatermarkVisible', true)

      if (isPro || isProPlus) {
        options.isWatermarkLessVisible = !!getSavedValue(
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
