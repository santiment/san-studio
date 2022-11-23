import { cacheIndicator, Indicator } from './../../lib/ChartWidget/MetricSettings/IndicatorSetting/utils';
import { buildMergedMetric } from './../../lib/HolderDistributionWidget/utils';
import { Metric } from './../../lib/metrics';
import { MetricType, newAddressMetric, newProjectMetric } from './../../lib/metrics/utils';
import { HolderDistributionMetric } from './../../lib/metrics/_onchain/holderDistributions';
export function shareMetrics(metrics) {
    return metrics.map(({ key }) => key);
}
function parseProjectLockedMetric([_, metricKey, slug, ticker]) {
    const metric = parseMetric(metricKey);
    return metric && newProjectMetric({ slug, ticker }, metric);
}
function parseIndicatorMetric([_, metricKey, indicatorKey]) {
    const indicator = Indicator[indicatorKey];
    if (!indicator)
        return;
    const metric = parseMetric(metricKey);
    return metric && cacheIndicator(metric, indicator);
}
function parseMergedSupplyDistributionMetric([_, base, ...mergedKeys]) {
    let isMissing = false;
    const baseMetrics = mergedKeys.map((key) => {
        const metric = HolderDistributionMetric[base + '_' + key];
        if (!metric)
            isMissing = true;
        return metric;
    });
    if (isMissing)
        return;
    return buildMergedMetric(baseMetrics);
}
function parseAddressLockedMetric([_, metricKey, address]) {
    const metric = Metric[metricKey];
    return metric && newAddressMetric(address, metric);
}
export function parseMetric(key) {
    let data = key;
    if (typeof key === 'string') {
        if (key[0] !== '[') {
            return Metric[key];
        }
        data = parseMetricKey(key);
    }
    switch (+data[0]) {
        case MetricType.ProjectLocked:
            return parseProjectLockedMetric(data);
        case MetricType.Indicator:
            return parseIndicatorMetric(data);
        case MetricType.MergedSupplyDistribution:
            return parseMergedSupplyDistributionMetric(data);
        case MetricType.AddressLocked:
            return parseAddressLockedMetric(data);
    }
}
export function parseMetricKey(key) {
    return getTupleData(key.slice(1, -1).split(';'));
}
export function getTupleData(args, cursor = { i: 0 }) {
    const data = [];
    for (; cursor.i < args.length; cursor.i++) {
        const arg = args[cursor.i];
        if (arg.endsWith(']')) {
            data.push(arg.slice(0, -1));
            return data;
        }
        if (arg.startsWith('[')) {
            cursor.i++;
            data.push([arg.slice(1), ...getTupleData(args, cursor)]);
            continue;
        }
        data.push(arg);
    }
    return data;
}
// parseTuple('[2;[1;price_usd;bitcoin;BTC];MA30]')
//# sourceMappingURL=metrics.js.map