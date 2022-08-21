import { Metric } from './../../../lib/metrics';
import { FORMATTER } from './../../../lib/metrics/formatters';
import { yAxisFormatter } from './../../../lib/Chart/Axes/utils';
const axisFormatter = (value) => yAxisFormatter(Math.abs(value));
export const MirroredMetric = {
    // [bottom metric key]   :   [top metric]
    [Metric.exchange_outflow.key]: Metric.exchange_inflow,
    [Metric.sentiment_negative_total.key]: Metric.sentiment_positive_total,
    [Metric.sentiment_negative_telegram.key]: Metric.sentiment_positive_telegram,
    [Metric.sentiment_negative_reddit.key]: Metric.sentiment_positive_reddit,
    [Metric.sentiment_negative_twitter.key]: Metric.sentiment_positive_twitter,
};
Object.keys(MirroredMetric).forEach((key) => {
    const bottomMetric = Metric[key];
    const topMetric = MirroredMetric[key];
    const { formatter = FORMATTER } = bottomMetric;
    topMetric.axisFormatter = axisFormatter;
    bottomMetric.axisFormatter = axisFormatter;
    bottomMetric.domainGroup = topMetric.key;
    bottomMetric.formatter = (value) => formatter(value && Math.abs(value));
});
const preTransformMirroredMetric = (metricKey) => (data) => data.map((item) => ({
    datetime: item.datetime,
    [metricKey]: -item[metricKey],
}));
export function transformMirroredMetric(metric, metricSettings, metrics) {
    if (metrics.includes(MirroredMetric[metric.key])) {
        metricSettings.preTransform = preTransformMirroredMetric(metric.key);
        metricSettings.getPreTransformValue = (value) => -value;
    }
    else {
        delete metricSettings.preTransform;
        delete metricSettings.getPreTransformValue;
    }
    return metricSettings;
}
//# sourceMappingURL=mirroredMetrics.js.map