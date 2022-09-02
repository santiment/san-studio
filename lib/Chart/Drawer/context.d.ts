export declare type Drawer = {
  isDrawing: boolean
  isNewDrawing: SAN.Charts.NewDrawingType
  drawings: SAN.Charts.Drawing[]
  selectedLine: undefined | SAN.Charts.Drawing
}
export declare type ChartDrawerStore = ReturnType<typeof newChartDrawerStore>
export declare const setChartDrawer: (chart: ChartDrawerStore) => {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: ((value?: any) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set: (this: void, value: any) => void
  redrawDrawers: () => void
  addDrawer(drawer: any): () => boolean
  addDrawing(drawing: any): void
  deleteDrawing(drawing: any): void
  selectDrawing(drawing: any): void
  toggleNewDrawing(type: SAN.Charts.NewDrawingType): void
  setIsDrawing(isDrawing: boolean): void
  toggleVisibility(value: boolean): void
  dispatch(event: any): void
  onDispatch(subscriber: any): () => boolean
}
export declare const getChartDrawer: () => ChartDrawerStore
export declare function newChartDrawerStore(defaultValue?: SAN.Charts.Drawing[]): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: ((value?: any) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set: (this: void, value: any) => void
  redrawDrawers: () => void
  addDrawer(drawer: any): () => boolean
  addDrawing(drawing: any): void
  deleteDrawing(drawing: any): void
  selectDrawing(drawing: any): void
  toggleNewDrawing(type: SAN.Charts.NewDrawingType): void
  setIsDrawing(isDrawing: boolean): void
  toggleVisibility(value: boolean): void
  dispatch(event: any): void
  onDispatch(subscriber: any): () => boolean
}
