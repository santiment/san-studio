import { each } from './../../metrics/utils';
export const LABELS = [
    'KuCoin',
    'Poloniex',
    'Kraken',
    'Binance',
    'Bitfinex',
    'Gate',
    'Bittrex',
    'Huobi',
    'Coinbase',
    'OKEx',
    'Bitstamp',
];
const checkIsVisible = ({ slug }) => slug === 'bitcoin';
const ExchangesV2Metric = {
    labelled_historical_balance: { label: '' },
};
const eachLabel = (clb) => LABELS.forEach((label) => clb(label, `santiment/owner->${label.toLowerCase()}:v1`));
eachLabel((label, label_fqn) => {
    ExchangesV2Metric['lhb_' + label] = {
        checkIsVisible,
        queryKey: 'labelled_historical_balance',
        label: `${label} Historical Balance`,
        reqMeta: { label_fqn },
    };
});
eachLabel((label, label_fqn) => {
    ExchangesV2Metric['lhbc_' + label] = {
        checkIsVisible,
        queryKey: 'labelled_historical_balance_changes',
        label: `${label} Historical Balance Changes`,
        reqMeta: { label_fqn },
    };
});
each(ExchangesV2Metric, (metric) => (metric.group = 'Exchanges 2.0'));
export { ExchangesV2Metric };
//# sourceMappingURL=exchangesV2.js.map