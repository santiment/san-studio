import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

export type Drawing = {
  color: string
  absCoor: [number, number, number, number]
  relCoor: [number, number, number, number]
}

export type Drawer = {
  isDrawing: boolean
  isNewDrawing: boolean
  drawings: Drawing[]
  selectedLine: undefined | Drawing
}
export type ChartDrawerStore = ReturnType<typeof newChartDrawerStore>

const DRAWER = {
  isDrawing: false,
  isNewDrawing: false,
  selectedLine: undefined,
}

const CONTEXT = 'chartDrawer'
export const setChartDrawer = (chart: ChartDrawerStore): void =>
  setContext(CONTEXT, chart)
export const getChartDrawer = (): ChartDrawerStore => getContext(CONTEXT)

export function newChartDrawerStore(defaultValue?: Drawing[]) {
  const controller = Object.assign({ drawings: defaultValue || [] }, DRAWER)
  const { subscribe, set } = writable<Drawer>(controller)

  const store = {
    subscribe,
    set,
    toggleNewDrawing() {
      controller.isNewDrawing = !controller.isNewDrawing
      set(controller)
    },
  }
  return store
}
