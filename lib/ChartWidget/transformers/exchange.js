import { Metric } from './../../metrics/index.js';
import { isExchangeModifiable } from '../MetricSettings/ExchangeSetting/utils.js';
export function transformExchangeSettings(metric, metricSettings) {
    if (!isExchangeModifiable(metric))
        return;
    const baseKey = (metric.base || metric).key;
    if (baseKey !== Metric.exchange_open_interest.key &&
        baseKey !== Metric.funding_rates_aggregated_by_exchange) {
        return;
    }
    if (metricSettings.owner)
        return;
    const { key, queryKey = key, isRootExchangeKey } = metric;
    metricSettings.owner = 'binance';
    metricSettings.queryKey = queryKey + (isRootExchangeKey ? '' : '_per_exchange');
}
//# sourceMappingURL=exchange.js.map