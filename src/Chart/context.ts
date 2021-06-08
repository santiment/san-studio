import type { initChart } from 'san-chart'
import { setContext, getContext } from 'svelte'

type SanChart = ReturnType<typeof initChart>
export type Chart = SanChart & {
  plotManager: ReturnType<typeof newPlotManager>
  tooltip?: any
  drawTooltip?: (point: any, y: number) => any
  isDrawing: boolean
  isSelecting: boolean
  drawSelection?: (x: number, y: number, point: any) => any
  scale: any
  axesMetricKeys?: string[]
  domainGroups?: string[][]
  colors: { [metricKey: string]: string }
  theme: any
}

const noop = () => {} // eslint-disable-line
export const CONTEXT = 'chartManager'
export const setChart = (chart: Chart): void => setContext(CONTEXT, chart)
export const getChart = (): Chart => getContext(CONTEXT)

export type Plotter = (
  chart: any,
  scale: any,
  data: any,
  colors: any,
  categories: any,
) => any
export function newPlotManager() {
  const subscribers = new Set<any>()
  const call = (subscriber) => subscriber()

  return {
    items: new Map<string, Plotter>(),
    delete(id: string) {
      this.items.set(id, noop)
    },
    set(id: string, clb: Plotter) {
      this.items.set(id, clb)
    },
    subscribe(subscriber) {
      subscribers.add(subscriber)
      return () => subscribers.delete(subscriber)
    },
    emitDrawFinish() {
      subscribers.forEach(call)
    },
  }
}
