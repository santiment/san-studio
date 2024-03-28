import { writable } from 'svelte/store';
import { newChartColors } from './../../Chart/colors/index.js';
import { Node } from '../nodes.js';
export function newChartColorsStore(defaultValue) {
    let colors = Object.assign({}, defaultValue);
    const { subscribe, set } = writable(colors);
    const get = () => colors;
    return {
        subscribe,
        get,
        set(metricKey, color) {
            colors[metricKey] = color;
            set((colors = Object.assign({}, colors)));
        },
        update(metrics) {
            const referenceMetrics = new Set();
            const _colors = newChartColors(metrics.filter((metric) => {
                if (metric.node !== Node.REFERENCE)
                    return true;
                referenceMetrics.add(metric);
            }), colors);
            referenceMetrics.forEach((metric) => {
                const { key } = metric;
                const target = metric.project
                    ? metric.key.replace(metric.base.key, metric.references)
                    : metric.references;
                _colors[key] = _colors[target];
            });
            set((colors = _colors));
        },
        replace(oldMetricKey, newMetricKey) {
            colors[newMetricKey] = colors[oldMetricKey];
            set(colors);
        },
    };
}
//# sourceMappingURL=context.js.map