import { SelectorNode } from './../metrics/selector/index.js';
export function shareChartAddons(chartAddons) {
    const items = chartAddons || [];
    if (items.length === 0)
        return;
    return items.map(({ key }) => key);
}
export function parseChartAddons(chartAddons) {
    const items = chartAddons || [];
    return items.map((key) => SelectorNode[key]).filter(Boolean);
}
//# sourceMappingURL=addons.js.map