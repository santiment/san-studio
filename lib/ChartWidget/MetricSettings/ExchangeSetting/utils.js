import { query } from 'san-webkit/lib/api';
import { Metric } from './../../../metrics/index.js';
export const DEFAULT_EXCHANGE = 'Auto (Default)';
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
        base === Metric.exchange_balance ||
        base === Metric.exchange_open_interest);
}
//# sourceMappingURL=utils.js.map