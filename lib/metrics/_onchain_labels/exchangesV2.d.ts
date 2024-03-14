export declare const LABELS: readonly ["KuCoin", "Poloniex", "Kraken", "Binance", "Bitfinex", "Gate", "Bittrex", "Huobi", "Coinbase", "OKEx", "Bitstamp"];
export declare const DISPLAY_LABELS: Partial<Record<(typeof LABELS)[number], string>>;
declare const ExchangesV2Metric: {
    labelled_historical_balance: Studio.Metric;
};
export { ExchangesV2Metric };
