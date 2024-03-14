import { each } from './../../metrics/utils.js';
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
export const DISPLAY_LABELS = {
    OKEx: 'OKX',
};
const ExchangesV2Metric = {
    labelled_historical_balance: { label: '' },
};
const eachLabel = (clb) => LABELS.forEach((label) => clb(label, `santiment/owner->${label.toLowerCase()}:v1`));
eachLabel((label, label_fqn) => {
    var _a;
    ExchangesV2Metric['lhb_' + label] = {
        queryKey: 'labelled_historical_balance',
        label: `${(_a = DISPLAY_LABELS[label]) !== null && _a !== void 0 ? _a : label} Historical Balance`,
        reqMeta: { label_fqn },
    };
});
eachLabel((label, label_fqn) => {
    var _a;
    ExchangesV2Metric['lhbc_' + label] = {
        queryKey: 'labelled_historical_balance_changes',
        label: `${(_a = DISPLAY_LABELS[label]) !== null && _a !== void 0 ? _a : label} Historical Balance Changes`,
        reqMeta: { label_fqn },
    };
});
each(ExchangesV2Metric, (metric) => (metric.group = 'Exchanges 2.0'));
export { ExchangesV2Metric };
//# sourceMappingURL=exchangesV2.js.map