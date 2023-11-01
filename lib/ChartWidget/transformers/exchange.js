import { Metric } from './../../metrics/index.js';
import { isExchangeModifiable } from '../MetricSettings/ExchangeSetting/utils.js';
export function transformExchangeSettings(metric, metricSettings) {
    if (!isExchangeModifiable(metric))
        return;
    if ((metric.base || metric).key !== Metric.exchange_open_interest.key) {
        return;
    }
    if (metricSettings.owner)
        return;
    const { key, queryKey = key, isRootExchangeKey } = metric;
    metricSettings.owner = 'binance';
    metricSettings.queryKey = queryKey + (isRootExchangeKey ? '' : '_per_exchange');
}
//# sourceMappingURL=exchange.js.map