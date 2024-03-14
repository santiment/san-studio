import { MetricCategory } from './graph.js';
import { ratioPercentForamtter, ratioPercentAxisFormatter, usdFormatter } from './formatters.js';
import { each } from './utils.js';
export const DerivativesMetric = each({
    bitmex_perpetual_basis: {
        label: 'BitMEX Basis',
    },
    bitmex_perpetual_basis_ratio: {
        label: 'BitMEX Basis Ratio',
    },
    bitmex_perpetual_funding_rate: {
        node: 'greenRedBar',
        label: 'BitMEX Funding Rate',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    bitmex_perpetual_open_interest: {
        label: 'BitMEX Open Interest',
    },
    bitmex_perpetual_open_value: {
        label: 'BitMEX Open Value',
    },
    usdt_bnb_funding_rates: {
        label: 'Binance Funding Rate (USDT)',
        node: 'greenRedBar',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    busd_bnb_funding_rates: {
        label: 'Binance Funding Rate (BUSD)',
        node: 'greenRedBar',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    dydx_perpetual_funding_rate: {
        label: 'DyDx Exchange Funding Rates',
        node: 'greenRedBar',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    deribit_perpetual_funding_rate: {
        label: 'Deribit Exchange Funding Rates',
        node: 'greenRedBar',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    ftx_perpetual_funding_rate: {
        label: 'FTX Funding Rate',
        node: 'greenRedBar',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    exchange_open_interest: {
        label: 'Open Interest in USD per Exchange',
        formatter: usdFormatter,
        isRootExchangeKey: true,
    },
    open_interest_per_settlement_currency: {
        label: 'Open Interest in USD per Settlement Currency',
        formatter: usdFormatter,
    },
    total_open_interest: {
        label: 'Total Open Interest in USD',
        formatter: usdFormatter,
    },
    funding_rates_aggregated_by_exchange: {
        node: 'greenRedBar',
        label: 'Funding Rates Aggregated by Exchange',
        isRootExchangeKey: true,
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    funding_rates_aggregated_by_settlement_currency: {
        node: 'greenRedBar',
        label: 'Funding Rates Aggregated by Settlement Currency',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    total_funding_rates_aggregated_per_asset: {
        node: 'greenRedBar',
        label: 'Total Funding Rates Aggregated by Asset',
        formatter: ratioPercentForamtter,
        axisFormatter: ratioPercentAxisFormatter,
    },
}, (metric) => {
    metric.category = MetricCategory.Derivatives;
});
//# sourceMappingURL=_derivatives.js.map