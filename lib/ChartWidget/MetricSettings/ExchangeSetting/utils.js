import { query } from 'san-webkit/lib/api';
import { Metric } from './../../../../lib/metrics';
export const DEFAULT_EXCHANGE = 'All (CEX+DEX)';
export const DEFAULT_EXCHANGES = [DEFAULT_EXCHANGE];
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
        base === Metric.exchange_balance);
}
//# sourceMappingURL=utils.js.map