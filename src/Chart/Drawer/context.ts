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
  const store = Object.assign(
    {
      drawings: defaultValue || [
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
      set(store)
    },
    deleteDrawing(drawing) {
      if (store.selectedLine === drawing) store.selectedLine = undefined
      store.drawings = store.drawings.filter((d) => d !== drawing)
      set(store)
    },
    toggleNewDrawing() {
      store.isNewDrawing = !store.isNewDrawing
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
