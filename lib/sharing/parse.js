import { MetricType, newProjectMetric } from './../metrics/utils.js';
import { newExpessionMetric } from './../CombineDialog/utils.js';
import { parseMetric, parseMetricKey } from './metrics.js';
import { normalizeIds } from './utils.js';
export function parse(queryString) {
    const qs = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const entries = qs.split('&');
    const result = {};
    for (let i = 0, len = entries.length; i < len; i++) {
        const [key, value] = decodeURIComponent(entries[i]).split('=');
        result[key] = value;
    }
    return result;
}
export function parseArray(value, isArrayOfObjects = false) {
    if (!value)
        return [];
    if (isArrayOfObjects) {
        if (value.includes('};{')) {
            const DELIMITER = '_;;_';
            return value.replace(/\};\{/g, `}${DELIMITER}{`).split(DELIMITER);
        }
        else {
            return [value];
        }
    }
    return value.split(';');
}
export function parseMetrics(metricKeys, KnownMetric) {
    return (metricKeys || [])
        .map((key) => {
        const metric = KnownMetric[key] || parseMetric(key);
        return (KnownMetric[key] = metric);
    })
        .filter(Boolean);
}
export function parseCombinedMetrics(metrics, KnownMetric) {
    return (metrics || []).map(({ k, exp, l, bm }) => {
        const metric = newExpessionMetric(bm.map(parseMetric), exp, l);
        const [_, key, slug, ticker] = (parseMetricKey(k) || []);
        metric.key = (key || k);
        KnownMetric[k] = slug ? newProjectMetric({ slug, ticker }, metric) : metric;
        return metric;
    });
}
export function parseIndicators(metrics) {
    const MetricIndicators = {};
    metrics.forEach(({ indicator, base }) => {
        if (!indicator)
            return;
        if (!MetricIndicators[base.key]) {
            MetricIndicators[base.key] = new Set();
        }
        MetricIndicators[base.key].add(indicator.key);
    });
    return MetricIndicators;
}
export function parseMergedMetrics(metrics) {
    return metrics.filter((metric) => metric.__type === MetricType.MergedSupplyDistribution);
}
export function parseMetricGraphValue(values, metrics) {
    const result = {};
    (values || []).forEach((value, i) => {
        if (!value)
            return;
        const metric = metrics[i];
        if (metric)
            result[metric.key] = value;
    });
    return result;
}
export function parseAxesMetrics(metricIds, metrics) {
    if (!metrics)
        return;
    const disabledAxesMetrics = new Set(metrics);
    const axesMetrics = new Set();
    normalizeIds(metricIds || []).forEach((id) => {
        const metric = metrics[id];
        if (metric) {
            axesMetrics.add(metric);
            disabledAxesMetrics.delete(metric);
        }
    });
    return { axesMetrics, disabledAxesMetrics };
}
export function parsePinnedAxesMetrics(metricIds, metrics) {
    if (!metrics)
        return;
    return new Set(normalizeIds(metricIds || []).map((id) => metrics[id]));
}
//# sourceMappingURL=parse.js.map