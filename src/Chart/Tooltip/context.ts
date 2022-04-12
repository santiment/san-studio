import { setContext, getContext } from 'svelte'
import { findPointByDate, clearCtx } from '@/Chart/utils'

const IS_SYNC_ENABLED_CONTEXT = 'isTooltipSyncEnabled'
export const setIsTooltipSyncEnabled = (isEnabled: boolean) =>
  setContext(IS_SYNC_ENABLED_CONTEXT, isEnabled)
const getIsTooltipSyncEnabled = () => getContext(IS_SYNC_ENABLED_CONTEXT)

const CONTEXT = 'tooltipSynchronizer'
export const setTooltipSynchronizer = (store): void => setContext(CONTEXT, store)
export const getTooltipSynchronizer = () => getIsTooltipSyncEnabled() && getContext(CONTEXT)

export function newTooltipSynchronizer() {
  const subscribers = [] as Studio.Chart[]

  setTooltipSynchronizer({
    add(chart: Studio.Chart) {
      subscribers.push(chart)
    },
    sync(fromChart: Studio.Chart, datetime: number, y: number) {
      subscribers.forEach((chart) => {
        if (chart === fromChart) return

        if (datetime && chart.points.length) {
          const point = findPointByDate(chart.points, datetime)
          if (point && chart.drawTooltip) chart.drawTooltip(point, y)
        } else {
          clearCtx(chart, chart.tooltip.ctx)
        }
      })
    },
    delete(chart: Studio.Chart) {
      const index = subscribers.indexOf(chart)
      if (index > -1) subscribers.splice(index, 1)
    },
  })
}
