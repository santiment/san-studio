import type { Drawing } from './drawer'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

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
  const store = Object.assign(
    {
      drawings: defaultValue || [
        {
          type: 'line',
          absCoor: [],
          ratioCoor: [],
          relCoor: [1625081445421, 2000, 1629881445421, 2500],
        },

        {
          type: 'sticker',
          id: 'rocket',
          size: 50,
          absCoor: [],
          ratioCoor: [],
          relCoor: [1629881445421, 3000],
        },
      ],
    },
    DRAWER,
  )
  const { subscribe, set } = writable<any>(store)
  const subscribers = new Set<any>()
  const drawers = new Set<any>()
  const redrawDrawers = () => drawers.forEach((drawer) => drawer.redraw())

  return {
    subscribe,
    set,
    redrawDrawers,
    addDrawer(drawer) {
      drawers.add(drawer)
      return () => drawers.delete(drawer)
    },
    addDrawing(drawing) {
      store.drawings.push(drawing)
      set(store)
      redrawDrawers()
    },
    deleteDrawing(drawing) {
      if (store.selectedLine === drawing) store.selectedLine = undefined
      const index = store.drawings.indexOf(drawing)
      if (index === -1) return

      store.drawings.splice(index, 1)
      set(store)
      redrawDrawers()
    },
    selectDrawing(drawing) {
      store.selectedLine = drawing
      set(store)
    },
    toggleNewDrawing() {
      store.isNewDrawing = !store.isNewDrawing
      set(store)
    },
    setIsDrawing(isDrawing: boolean) {
      store.isDrawing = isDrawing
      if (isDrawing === false) store.isNewDrawing = false
      set(store)
    },
    dispatch(event: any) {
      subscribers.forEach((subscriber) => subscriber(event))
    },
    onDispatch(subscriber) {
      subscribers.add(subscriber)
      return () => subscribers.delete(subscriber)
    },
  }
}
