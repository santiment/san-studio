import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
const DRAWER = {
  isDrawing: false,
  isNewDrawing: false,
  selectedLine: undefined,
  isHidden: false,
}
const CONTEXT = 'chartDrawer'
export const setChartDrawer = (chart) => setContext(CONTEXT, chart)
export const getChartDrawer = () => getContext(CONTEXT)
export function newChartDrawerStore(defaultValue) {
  const store = Object.assign({ drawings: defaultValue || [] }, DRAWER)
  const { subscribe, set } = writable(store)
  const subscribers = new Set()
  const drawers = new Set()
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
    toggleNewDrawing(type) {
      const newDrawing = type === store.isNewDrawing ? null : type
      store.isNewDrawing = newDrawing
      set(store)
    },
    setIsDrawing(isDrawing) {
      store.isDrawing = isDrawing
      if (isDrawing === false) store.isNewDrawing = null
      set(store)
    },
    toggleVisibility(value) {
      store.isHidden = value
      store.selectedLine = undefined
      set(store)
      redrawDrawers()
    },
    dispatch(event) {
      subscribers.forEach((subscriber) => subscriber(event))
    },
    onDispatch(subscriber) {
      subscribers.add(subscriber)
      return () => subscribers.delete(subscriber)
    },
  }
}
//# sourceMappingURL=context.js.map
