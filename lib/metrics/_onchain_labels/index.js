import { queryTopHoldersPercentOfTatalSupply } from './../../api/timeseries/queries/topHoldersPercentOfTotalSupply.js';
import { MetricCategory, MetricGroup } from '../graph.js';
import { each } from '../utils.js';
import { ExchangesV2Metric } from './exchangesV2.js';
const ExchangesMetrics = each({
    exchange_inflow: {
        label: 'Exchange Inflow',
    },
    exchange_outflow: {
        label: 'Exchange Outflow',
    },
    exchange_balance: {
        label: 'Exchange Flow Balance',
        shorthand: 'efb',
    },
    supply_on_exchanges: {
        label: 'Supply on Exchanges',
    },
    supply_outside_exchanges: {
        label: 'Supply outside of Exchanges',
    },
    percent_of_total_supply_on_exchanges: {
        label: 'Supply on Exchanges (as % of total supply)',
    },
    amount_in_exchange_top_holders: {
        label: 'Supply held by top exchange addresses',
    },
}, (metric) => (metric.group = MetricGroup.Exchanges));
export const TopHoldersMetrics = each({
    amount_in_top_holders: {
        label: 'Supply held by top addresses',
    },
    amount_in_non_exchange_top_holders: {
        label: 'Supply held by top non-exchange addresses',
    },
    topHoldersPercentOfTotalSupply: {
        label: 'Supply held by top addresses (as % of total supply)',
        shorthand: 'ahta',
        fetch: queryTopHoldersPercentOfTatalSupply,
    },
    whale_transaction_count_100k_usd_to_inf: {
        label: 'Whale Transaction Count (>100k USD)',
        node: 'bar',
    },
    whale_transaction_count_1m_usd_to_inf: {
        label: 'Whale Transaction Count (>1m USD)',
        node: 'bar',
    },
    percent_of_whale_stablecoin_total_supply: {
        label: 'Percent of Stablecoin Total Supply held by Whales with more than 5 million USD',
        getLabel: () => 'Percent of Stablecoin Total Supply held by Whales with more than 5 million USD',
        noProject: true,
        reqMeta: {
            slug: 'ethereum',
        },
    },
}, (metric) => (metric.group = MetricGroup.TopHolders));
const ExchangeUsersMetrics = each({
    active_deposits: {
        label: 'Active Deposits',
        node: 'bar',
        queryKey: 'active_deposits_5m',
    },
    deposit_transactions: {
        label: 'Deposit Transactions',
        queryKey: 'deposit_transactions_5m',
    },
    withdrawal_transactions: {
        label: 'Withdrawal Transactions',
        queryKey: 'withdrawal_transactions_5m',
    },
    active_withdrawals_5m: {
        label: 'Active Withdrawals',
    },
}, (metric) => (metric.group = MetricGroup.ExchangeUsers));
const FundsMetrics = each({
    amount_in_funds: {
        label: 'Supply held by Funds',
        queryKey: 'labelled_historical_balance',
        reqMeta: {
            label_fqn: 'santiment/fund:v1',
        },
    },
}, (metric) => (metric.group = MetricGroup.Funds));
const DeFiMetrics = each({
    amount_in_bridges: {
        label: 'Supply held by Bridges',
        queryKey: 'labelled_historical_balance',
        reqMeta: {
            label_fqn: 'santiment/bridge:v1',
        },
    },
    amount_in_lendings: {
        label: 'Supply held by Lendings',
        queryKey: 'labelled_historical_balance',
        reqMeta: {
            label_fqn: 'santiment/lending:v1',
        },
    },
}, (metric) => (metric.group = MetricGroup.DeFi));
const MinersMetrics = each({
    amount_in_miners: {
        label: 'Supply held by Miners',
        queryKey: 'labelled_historical_balance',
        reqMeta: {
            label_fqn: 'santiment/miner:v1',
        },
    },
}, (metric) => (metric.group = MetricGroup.Miners));
export const OnChainLabelsMetrics = each(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ExchangesMetrics), TopHoldersMetrics), ExchangeUsersMetrics), ExchangesV2Metric), FundsMetrics), DeFiMetrics), MinersMetrics), (metric) => (metric.category = MetricCategory.OnChainLabels));
//# sourceMappingURL=index.js.map