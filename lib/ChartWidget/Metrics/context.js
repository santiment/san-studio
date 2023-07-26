import { get, writable } from 'svelte/store';
import { track } from 'san-webkit/lib/analytics';
import { Event } from './../../analytics.js';
import { studio } from './../../stores/studio.js';
import { convertBaseProjectMetric } from './utils.js';
const getKey = ({ key }) => key;
const DEFAULT = [];
export function newMetricsStore(defaultMetrics = DEFAULT) {
    let metrics = defaultMetrics.slice();
    let metricSet = new Set(metrics);
    const { subscribe, set } = writable(metrics);
    const update = () => set((metrics = Array.from(metricSet)));
    return {
        subscribe,
        getValue() {
            return metrics;
        },
        set(newMetrics) {
            metricSet = new Set(newMetrics);
            update();
        },
        add(metric) {
            metricSet.add(metric);
            update();
            const asset = get(studio).slug;
            track.event(Event.AddMetric, { metric: metric.key, asset });
        },
        delete(metric) {
            metricSet.delete(metric);
            update();
            const asset = get(studio).slug;
            track.event(Event.RemoveMetric, { metric: metric.key, asset });
        },
        toggle(metric) {
            if (metricSet.has(metric)) {
                this.delete(metric);
            }
            else {
                this.add(metric);
            }
        },
        replace(index, newMetric) {
            metrics[index] = newMetric;
            metricSet = new Set(metrics);
            set(metrics);
        },
        concat(newMetrics) {
            metricSet = new Set(metrics.concat(newMetrics));
            update();
            track.event(Event.AddMetrics, {
                metrics: newMetrics.map(getKey),
                asset: get(studio).slug,
            });
        },
        deleteEach(metrics) {
            metrics.forEach((metric) => metricSet.delete(metric));
            update();
        },
        hasConvertedMetric(metric, project) {
            const { key } = convertBaseProjectMetric(metric, project);
            return metrics.some((metric) => key === metric.key);
        },
    };
}
export function newHiddenMetricsStore(defaultMetrics = []) {
    const value = new Set(defaultMetrics);
    const { subscribe, set } = writable(value);
    return {
        subscribe,
        set,
        hide(metric) {
            value.add(metric);
            set(value);
        },
        show(metric) {
            value.delete(metric);
            set(value);
        },
        toggle(metric) {
            if (value.has(metric))
                value.delete(metric);
            else
                value.add(metric);
            set(value);
        },
        has(metric) {
            return value.has(metric);
        },
    };
}
//# sourceMappingURL=context.js.map