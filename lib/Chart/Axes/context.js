import { writable } from 'svelte/store';
export function newChartAxesStore(defaultEnabled, defaultDisabled) {
    let MetricPosition = {};
    let shared = new Set();
    let enabled = new Set(defaultEnabled);
    const disabled = new Set(defaultDisabled);
    const { subscribe, set } = writable(enabled);
    return {
        subscribe,
        delete(metric) {
            disabled.delete(metric);
        },
        toggle(metric) {
            if (shared.has(metric.key))
                return;
            if (enabled.has(metric)) {
                enabled.delete(metric);
                disabled.add(metric);
            }
            else {
                const metrics = Array.from(enabled);
                metrics.splice(MetricPosition[metric.key], 0, metric);
                enabled = new Set(metrics);
                disabled.delete(metric);
            }
            set(enabled);
        },
        updateMetrics(metrics, exceptionsMap, domainGroups = []) {
            MetricPosition = {};
            const newEnabled = new Set();
            let sharedAxes = [];
            for (let i = 0, len = domainGroups.length; i < len; i++) {
                sharedAxes = sharedAxes.concat(domainGroups[i].slice(1));
            }
            shared = new Set(sharedAxes);
            const { length } = metrics;
            for (let i = 0; i < length; i++) {
                const metric = metrics[i];
                MetricPosition[metric.key] = i;
                // prettier-ignore
                if (disabled.has(metric) || exceptionsMap.has(metric) || shared.has(metric.key))
                    continue;
                if (enabled.has(metric) || newEnabled.size < 3)
                    newEnabled.add(metric);
            }
            set((enabled = newEnabled));
        },
    };
}
export function newPinnedChartAxesStore(defaults) {
    const pinned = new Set(defaults);
    const { subscribe, set } = writable(pinned);
    return {
        subscribe,
        has(metric) {
            return pinned.has(metric);
        },
        toggle(metric) {
            if (this.has(metric))
                this.delete(metric);
            else
                this.add(metric);
        },
        add(metric) {
            pinned.add(metric);
            set(pinned);
        },
        delete(metric) {
            pinned.delete(metric);
            set(pinned);
        },
    };
}
//# sourceMappingURL=context.js.map