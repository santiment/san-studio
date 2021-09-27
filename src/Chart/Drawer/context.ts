import type { Drawing } from './drawer'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

export type Drawer = {
  isDrawing: boolean
  isNewDrawing: boolean
  drawings: Drawing[]
  selectedLine: undefined | Drawing
  isAwaitingRedraw: boolean
}
export type ChartDrawerStore = ReturnType<typeof newChartDrawerStore>

const DRAWER = {
  isDrawing: false,
  isNewDrawing: false,
  selectedLine: undefined,
  isAwaitingRedraw: false,
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
          relCoor: [1625081445421, 2000, 1629881445421, 2500],
        },

        {
          type: 'sticker',
          id: 'rocket',
          size: 50,
          absCoor: [],
          relCoor: [1629881445421, 3000],
        },
      ],
    },
    DRAWER,
  )
  const { subscribe, set } = writable<Drawer>(store)
  const subscribers = new Set<any>()

  return {
    subscribe,
    set,
    addDrawing(drawing) {
      store.drawings.push(drawing)
      store.isAwaitingRedraw = true
      set(store)
    },
    deleteDrawing(drawing) {
      if (store.selectedLine === drawing) store.selectedLine = undefined
      const index = store.drawings.indexOf(drawing)
      if (index === -1) return

      store.drawings.splice(index, 1)
      store.isAwaitingRedraw = true
      set(store)
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
