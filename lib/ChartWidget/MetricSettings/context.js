import { writable } from 'svelte/store';
const noopTransformer = (_, __, ___) => __; // eslint-disable-line
export function newMetricSettingsStore(defaultValue) {
    let MetricSettings = (defaultValue || {});
    const { subscribe, set } = writable(MetricSettings);
    const store = {
        subscribe,
        getValue() {
            return MetricSettings;
        },
        getMetricSettings(metricKey) {
            return MetricSettings[metricKey] || (MetricSettings[metricKey] = {});
        },
        replace(oldMetricKey, newMetricKey) {
            MetricSettings[newMetricKey] = MetricSettings[oldMetricKey];
            set(MetricSettings);
        },
        set(metricKey, setting) {
            const metricSettings = store.getMetricSettings(metricKey);
            Object.assign(metricSettings, setting);
            set(MetricSettings);
        },
        delete(metricKey, settingKey) {
            const metricSettings = MetricSettings[metricKey];
            if (metricSettings) {
                delete metricSettings[settingKey];
                set(MetricSettings);
            }
        },
        update(metrics, transformer = noopTransformer) {
            const NewMetricSetings = {};
            metrics.forEach((metric) => {
                const metricSettings = MetricSettings[metric.key] || {};
                NewMetricSetings[metric.key] = transformer(metric, metricSettings, metrics);
            });
            set((MetricSettings = NewMetricSetings));
        },
    };
    return store;
}
//# sourceMappingURL=context.js.map