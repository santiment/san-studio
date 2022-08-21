import { saveJson, getSavedJson, saveValue, getSavedValue, deleteSavedValue, } from 'san-webkit/lib/utils/localStorage';
import { RecentType, addRecent, removeRecent } from 'san-webkit/lib/utils/recents';
export function getAllWidgetsMetrics(widgets) {
    // @ts-ignore
    return [...new Set(widgets.map(({ metrics }) => metrics).flat())].filter(Boolean);
}
export const getAllWidgetsMetricsKeys = (widgets) => getAllWidgetsMetrics(widgets).map(({ key }) => key);
const getMetricData = ({ key, queryKey = key }, { reqMeta }) => ({
    metric: queryKey,
    slug: reqMeta === null || reqMeta === void 0 ? void 0 : reqMeta.slug,
});
export function getLayoutMetrics(widgets) {
    let index = 0;
    const metrics = {};
    // NOTE: Backend accepts jsonb map, that's why index is used as a unique key [vanguard, 30 Mar 2022]
    const addMetric = (metric) => (metrics[index++] = getMetricData(metric.base || metric, metric));
    getAllWidgetsMetrics(widgets).forEach((metric) => {
        const { baseMetrics } = metric;
        if (baseMetrics) {
            return baseMetrics.forEach(addMetric);
        }
        addMetric(metric);
    });
    return metrics;
}
const RECENT_LAYOUTS = 'RECENT_TEMPLATES';
function removeRecentLayout(id) {
    const items = new Set(getSavedRecentLayoutIds());
    items.delete(+id);
    return [...items];
}
const mapSavedRecentLayoutIds = (value) => +value;
export function getSavedRecentLayoutIds() {
    const value = getSavedValue(RECENT_LAYOUTS, '');
    return value ? value.split(',').map(mapSavedRecentLayoutIds) : [];
}
export function addRecentLayoutId(id) {
    addRecent(RecentType.CHART_LAYOUT, id);
    return saveRecentLayoutIds([+id, ...removeRecentLayout(id)]);
}
export function removeRecentLayoutId(id) {
    removeRecent(RecentType.CHART_LAYOUT, id);
    return saveRecentLayoutIds(removeRecentLayout(id));
}
function saveRecentLayoutIds(items) {
    const recents = items.slice(0, 5);
    saveValue(RECENT_LAYOUTS, recents.filter(Boolean).toString());
    return recents;
}
const SCHEDULED_CHART = 'SCHEDULED_CHART';
export const saveScheduledLayout = (layout) => saveJson(SCHEDULED_CHART, layout);
export const getScheduledLayout = () => getSavedJson(SCHEDULED_CHART);
export const deleteScheduledLayout = () => deleteSavedValue(SCHEDULED_CHART);
//# sourceMappingURL=utils.js.map