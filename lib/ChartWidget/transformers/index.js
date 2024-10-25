import { parseIntervalString } from 'san-webkit/lib/utils/dates';
import { Metric } from './../../metrics/index.js';
import { transformCandles } from './candles.js';
import { transformWeightedSocialMetrics } from './weightedSocial.js';
import { transformExchangeSettings } from './exchange.js';
import { transformRsiSettings } from './rsi.js';
import { transformMorpho } from './morpho.js';
const IntervalFormatDividend = {
    h: 24,
    m: 60 * 24,
};
export function calculateMovingAverageFromInterval(interval) {
    const { amount, format } = parseIntervalString(interval || '24h');
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
    transformExchangeSettings(metric, metricSettings);
    transformRsiSettings(metric, metricSettings);
    transformMorpho(metric, metricSettings);
    if (key === Metric.dev_activity.key)
        return transformDevActivity(metricSettings, studioSettings);
    // if (MirroredMetric[metric.key]) return transformMirroredMetric(metric, metricSettings, metrics)
    return metricSettings;
}
export function newMetricSettingsTransformer(settings, ChartMetricDisplays) {
    return (metric, metricSettings, metrics) => transformMetricSettings(metric, metricSettings, metrics, settings, ChartMetricDisplays);
}
//# sourceMappingURL=index.js.map