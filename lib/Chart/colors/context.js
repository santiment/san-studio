import { writable } from 'svelte/store';
import { newChartColors } from './../../Chart/colors';
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
            set((colors = newChartColors(metrics, colors)));
        },
        replace(oldMetricKey, newMetricKey) {
            colors[newMetricKey] = colors[oldMetricKey];
            set(colors);
        },
    };
}
//# sourceMappingURL=context.js.map