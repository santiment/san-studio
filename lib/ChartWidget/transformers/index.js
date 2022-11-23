import { parseIntervalString } from 'san-webkit/lib/utils/dates';
import { Metric } from './../../../lib/metrics';
import { MirroredMetric, transformMirroredMetric } from './mirroredMetrics';
import { transformCandles } from './candles';
import { transformWeightedSocialMetrics } from './weightedSocial';
const IntervalFormatDividend = {
    h: 24,
    m: 60 * 24,
};
export function calculateMovingAverageFromInterval(interval) {
    const { amount, format } = parseIntervalString(interval);
    const dividend = IntervalFormatDividend[format] || 1;
    return (dividend / amount) * 7;
}
function transformDevActivity(metricSettings, { interval }) {
    metricSettings.transform = {
        type: 'moving_average',
        movingAverageBase: calculateMovingAverageFromInterval(interval),
    };
    return metricSettings;
}
export function transformMetricSettings(metric, metricSettings, metrics, studioSettings, ChartMetricDisplays) {
    const { key } = metric.base || metric;
    transformCandles(metric, metricSettings, studioSettings, ChartMetricDisplays);
    transformWeightedSocialMetrics(metric, metricSettings, studioSettings);
    if (key === Metric.dev_activity.key)
        return transformDevActivity(metricSettings, studioSettings);
    if (MirroredMetric[metric.key])
        return transformMirroredMetric(metric, metricSettings, metrics);
    return metricSettings;
}
export function newMetricSettingsTransformer(settings, ChartMetricDisplays) {
    return (metric, metricSettings, metrics) => transformMetricSettings(metric, metricSettings, metrics, settings, ChartMetricDisplays);
}
//# sourceMappingURL=index.js.map