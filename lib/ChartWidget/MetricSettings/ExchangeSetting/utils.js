import { query } from 'san-webkit/lib/api';
import { Metric } from './../../../metrics/index.js';
const DEFAULT_EXCHANGE = 'Auto (CEX+DEX)';
const DEFAULT_EXCHANGE_OPEN_INTEREST = 'Auto (Binance)';
export const ExchangeMetricsDefaults = {
    label: DEFAULT_EXCHANGE,
    owners: [DEFAULT_EXCHANGE],
    onDefault: (MetricSettings, key) => {
        MetricSettings.delete(key, 'queryKey');
        MetricSettings.delete(key, 'owner');
    },
};
export const OpenInterestMetricsDefaults = {
    label: DEFAULT_EXCHANGE_OPEN_INTEREST,
    owners: [DEFAULT_EXCHANGE_OPEN_INTEREST],
    onDefault: (MetricSettings, key) => {
        MetricSettings.set(key, { owner: 'binance' });
    },
};
const EXCHANGES_QUERY = (slug, isDex) => `
  {
    allExchanges(slug: "${slug}", isDex: ${isDex})
  }
`;
const accessor = ({ allExchanges }) => allExchanges;
export function queryProjectExchanges(slug, isDex = false) {
    return query(EXCHANGES_QUERY(slug, isDex)).then(accessor);
}
export function isExchangeModifiable(metric) {
    const { base = metric } = metric;
    return (base === Metric.exchange_outflow ||
        base === Metric.exchange_inflow ||
        base === Metric.exchange_balance ||
        base === Metric.exchange_open_interest);
}
//# sourceMappingURL=utils.js.map