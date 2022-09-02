import { newAddressMetric, newProjectMetric } from './../../../lib/metrics/utils';
import { cacheIndicator } from './../../../lib/ChartWidget/MetricSettings/IndicatorSetting/utils';
export function convertBaseProjectMetric(metric, settings) {
    var _a;
    if (metric.project) {
        const { base } = metric;
        return metric.indicator ? cacheIndicator(base.base, metric.indicator) : base;
    }
    if (metric.indicator) {
        return cacheIndicator(newProjectMetric(settings, metric.base), metric.indicator);
    }
    if ((_a = metric.reqMeta) === null || _a === void 0 ? void 0 : _a.address) {
        return metric.base;
    }
    if (settings.address) {
        return newAddressMetric(settings.address, metric);
    }
    return newProjectMetric(settings, metric);
}
//# sourceMappingURL=utils.js.map