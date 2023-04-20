import { setContext, getContext } from 'svelte';
import { findPointByDate, clearCtx } from './../../Chart/utils';
const IS_SYNC_ENABLED_CONTEXT = 'isTooltipSyncEnabled';
export const setIsTooltipSyncEnabled = (isEnabled) => setContext(IS_SYNC_ENABLED_CONTEXT, isEnabled);
const getIsTooltipSyncEnabled = () => getContext(IS_SYNC_ENABLED_CONTEXT);
const CONTEXT = 'tooltipSynchronizer';
export const setTooltipSynchronizer = (store) => setContext(CONTEXT, store);
export const getTooltipSynchronizer = () => getIsTooltipSyncEnabled() && getContext(CONTEXT);
export function newTooltipSynchronizer() {
    const subscribers = [];
    setTooltipSynchronizer({
        add(chart) {
            subscribers.push(chart);
        },
        sync(fromChart, datetime, y) {
            subscribers.forEach((chart) => {
                if (chart === fromChart)
                    return;
                if (datetime && chart.points.length) {
                    const point = findPointByDate(chart.points, datetime);
                    if (point && chart.drawTooltip)
                        chart.drawTooltip(point, y);
                }
                else {
                    clearCtx(chart, chart.tooltip.ctx);
                    if (chart.clear)
                        chart.clear();
                }
            });
        },
        delete(chart) {
            const index = subscribers.indexOf(chart);
            if (index > -1)
                subscribers.splice(index, 1);
        },
    });
}
//# sourceMappingURL=context.js.map