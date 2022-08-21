import { HolderDistributionMetric } from './holderDistributions';
import { MakerDaoMetric } from './makerDao';
import { ExchangesV2Metric } from './exchangesV2';
import { ContractAddressMetric } from './contractAddress';
import { MetricCategory } from './../../../lib/metrics/graph';
import { each } from './../../../lib/metrics/utils';
import { mvrvFormatter, ratioPercentAxisFormatter } from './../../../lib/metrics/formatters';
import { queryGasUsed } from './../../../lib/api/timeseries/queries/gasUsed';
import { mvrvPrecacher } from './../../../lib/api/timeseries/queries/mvrv';
import { queryEthSpentOverTime } from './../../../lib/api/timeseries/queries/ethSpentOverTime';
import { queryTopHoldersPercentOfTatalSupply } from './../../../lib/api/timeseries/queries/topHoldersPercentOfTotalSupply';
const ExchangesMetric = each({
    active_deposits: {
        label: 'Active Deposits',
        node: 'bar',
        queryKey: 'active_deposits_5m',
    },
    deposit_transactions: {
        label: 'Deposit Transactions',
        queryKey: 'deposit_transactions_5m',
    },
    exchange_balance: {
        label: 'Exchange Flow Balance',
        shorthand: 'efb',
    },
    exchange_inflow: {
        label: 'Exchange Inflow',
    },
    exchange_outflow: {
        label: 'Exchange Outflow',
    },
    percent_of_total_supply_on_exchanges: {
        label: 'Supply on Exchanges (as % of total supply)',
    },
    supply_on_exchanges: {
        label: 'Supply on Exchanges',
    },
    supply_outside_exchanges: {
        label: 'Supply outside of Exchanges',
    },
    withdrawal_transactions: {
        label: 'Withdrawal Transactions',
        queryKey: 'withdrawal_transactions_5m',
    },
    active_withdrawals_5m: {
        label: 'Active Withdrawals',
    },
}, (metric) => (metric.group = 'Exchanges'));
export const WhalesMetric = each({
    topHoldersPercentOfTotalSupply: {
        label: 'Supply held by top addresses (as % of total supply)',
        shorthand: 'ahta',
        fetch: queryTopHoldersPercentOfTatalSupply,
    },
    amount_in_exchange_top_holders: {
        label: 'Supply held by top exchange addresses',
    },
    amount_in_non_exchange_top_holders: {
        label: 'Supply held by top non-exchange addresses',
    },
    amount_in_top_holders: {
        label: 'Supply held by top addresses',
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
}, (metric) => (metric.group = 'Whales'));
const NetworkActivityMetric = each({
    active_addresses_1h: {
        label: 'Active Addresses 1h',
        node: 'bar',
    },
    active_addresses_24h: {
        label: 'Active Addresses 24h',
        node: 'bar',
    },
    circulation: {
        label: 'Circulation',
    },
    daily_active_addresses: {
        label: 'Daily Active Addresses',
        node: 'bar',
        shorthand: 'daa',
    },
    network_growth: {
        label: 'Network Growth',
    },
    transaction_volume: {
        label: 'Transaction Volume',
        node: 'bar',
    },
    transaction_volume_usd: {
        label: 'Transaction Volume USD',
        node: 'bar',
    },
    transaction_volume_in_profit: {
        label: 'Daily On-Chain Transaction Volume in Profit',
        node: 'bar',
    },
    transaction_volume_in_loss: {
        label: 'Daily On-Chain Transaction Volume in Loss',
        node: 'bar',
    },
    transaction_volume_profit_loss_ratio: {
        label: 'The Ratio of Daily On-Chain Transaction Volume in Profit to Loss',
        node: 'bar',
    },
    velocity: {
        label: 'Velocity',
    },
}, (metric) => (metric.group = 'Network Activity'));
const LongTermHoldersMetric = each({
    age_consumed: {
        label: 'Age Consumed',
        node: 'bar',
    },
    dormant_circulation_365d: {
        label: 'Dormant Circulation (365d)',
    },
    spent_coins_age_band_0d_to_1d: {
        label: 'Spent Coins Age Band',
    },
    realized_cap_hodl_waves_1d_to_7d: {
        label: 'Realized Market Capitalization Hodl Waves',
    },
}, (metric) => (metric.group = 'Long-term holders'));
const NetworkValueMetric = each({
    mean_age: {
        label: 'Mean Coin Age',
    },
    mean_dollar_invested_age: {
        label: 'Mean Dollar Invested Age',
    },
    mvrv_long_short_diff_usd: {
        label: 'MVRV Long/Short Difference',
        node: 'filledLine',
        formatter: mvrvFormatter,
        axisFormatter: ratioPercentAxisFormatter,
    },
    mvrv_usd: {
        label: 'MVRV Ratio',
        node: 'filledLine',
        formatter: mvrvFormatter,
        axisFormatter: ratioPercentAxisFormatter,
        precacher: mvrvPrecacher,
    },
    mvrv_usd_intraday: {
        label: 'MVRV Ratio Intraday',
        node: 'filledLine',
        formatter: mvrvFormatter,
        axisFormatter: ratioPercentAxisFormatter,
        precacher: mvrvPrecacher,
    },
    mvrv_usd_z_score: {
        label: 'MVRV Ratio (Z score)',
        node: 'filledLine',
    },
    network_profit_loss: {
        label: 'Network Realized Profit/Loss',
        node: 'filledLine',
    },
    nvt: {
        label: 'NVT Ratio (with Circulation)',
    },
    nvt_transaction_volume: {
        label: 'NVT Ratio (with Transaction Volume)',
    },
    nvt_5min: {
        label: 'Circulation NVT',
    },
    realized_value_usd: {
        label: 'Realized Cap',
    },
    stock_to_flow: {
        label: 'Stock to Flow ratio',
    },
}, (metric) => (metric.group = 'Network Value'));
export const DefiMetric = each({
    defi_total_value_locked_usd: {
        node: 'bar',
        label: 'Defi Total Value Locked in USD',
    },
}, (metric) => (metric.group = 'Defi'));
export const FeesMetric = each({
    average_fees_usd: {
        node: 'area',
        label: 'Average Fees (USD)',
        checkIsVisible: ({ slug }) => slug === 'ethereum',
    },
    median_fees_usd: {
        node: 'area',
        label: 'Median Fees (USD)',
        checkIsVisible: ({ slug }) => slug === 'ethereum',
    },
}, (metric) => (metric.group = 'Fees'));
export const NFTMetric = each({
    nft_trades_count: {
        node: 'filledLine',
        label: 'Total NFT Trades Count',
    },
    nft_trade_volume_usd: {
        node: 'bar',
        label: 'Total NFT Trades Volume In USD',
    },
    nft_whale_trades_count: {
        node: 'bar',
        label: 'Amount of Uniq Addresses Bought More Than 100k USD of NFTs',
    },
    nft_whale_trade_volume_usd: {
        node: 'bar',
        label: 'Total Volume For NFT Worth More Than 100k USD',
    },
    nft_retail_trades_count: {
        node: 'bar',
        label: 'Amount of Uniq Addresses Bought Less Than 1k USD of NFTs',
    },
    nft_retail_trade_volume_usd: {
        node: 'bar',
        label: 'Total Volume For NFT Worth Less Than 1k USD',
    },
}, (metric) => {
    metric.group = 'NFT harbor';
    metric.noProject = true;
    metric.reqMeta = { slug: 'ethereum' };
    metric.getLabel = () => metric.label;
});
export const OnChainMetric = each(Object.assign({
    ethSpentOverTime: {
        label: 'Eth Spent Over Time',
        fetch: queryEthSpentOverTime,
    },
    gasUsed: {
        label: 'Gas Used',
        fetch: queryGasUsed,
    },
    avg_gas_used: {
        label: 'Average Gas Used in Gwei',
    },
    miners_balance: {
        label: 'Miners Balance',
        category: 'On-chain',
        checkIsVisible: () => false,
    },
    nft_collection_trades_count: {
        label: 'Daily Trade Count of NFT Collections',
        isNFTMetric: true,
    },
}, ContractAddressMetric, FeesMetric, ExchangesMetric, ExchangesV2Metric, NFTMetric, DefiMetric, HolderDistributionMetric, WhalesMetric, LongTermHoldersMetric, NetworkActivityMetric, NetworkValueMetric, MakerDaoMetric), (metric) => (metric.category = MetricCategory.OnChain));
//# sourceMappingURL=index.js.map