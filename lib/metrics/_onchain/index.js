import { HolderDistributionMetric } from './holderDistributions.js';
import { XrpMetric } from './xrp.js';
import { MakerDaoMetric, MakerDaoDsrMetric } from './makerDao.js';
import { AaveMetric, Aave3Metric } from './aave.js';
import { CompoundMetric, Compound3Metric } from './compound.js';
import { LiquityMetric } from './liquity.js';
import { FraxlendMetric } from './fraxlend.js';
import { SparkMetric } from './spark.js';
import { FluidMetric } from './fluid.js';
import { MorphoMetric } from './morpho.js';
import { EthenaMetric } from './ethena.js';
import { SkySavingsMetric } from './skySavings.js';
import { PendleMarketsMetric } from './pendleMarkets.js';
import { Eth2Metric } from './eth2.js';
import { ContractAddressMetric } from './contractAddress.js';
import { MetricCategory } from './../../metrics/graph.js';
import { each } from './../../metrics/utils.js';
import { usdFormatter, mvrvFormatter, ratioPercentAxisFormatter } from './../../metrics/formatters.js';
import { queryGasUsed } from './../../api/timeseries/queries/gasUsed.js';
import { mvrvPrecacher } from './../../api/timeseries/queries/mvrv.js';
import { queryEthSpentOverTime } from './../../api/timeseries/queries/ethSpentOverTime.js';
const NetworkActivityMetric = each({
    active_addresses_1h: {
        label: 'Active Addresses 1h',
        node: 'bar',
    },
    active_addresses_24h: {
        label: 'Active Addresses 24h',
        node: 'bar',
    },
    active_addresses_7d: {
        label: 'Active Addresses 7d',
        node: 'bar',
    },
    active_addresses_30d: {
        label: 'Active Addresses 30d',
        node: 'bar',
    },
    active_addresses_60d: {
        label: 'Active Addresses 60d',
        node: 'bar',
    },
    active_addresses_90d: {
        label: 'Active Addresses 90d',
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
    transactions_count: {
        label: 'Transaction Count',
    },
    payments_count: {
        label: 'Payment Count',
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
    realized_cap_hodl_waves_0d_to_1d: {
        label: 'Realized Cap HODL Waves (0d to 1d)',
    },
    stock_to_flow: {
        label: 'Stock to Flow ratio',
    },
    total_supply_in_profit: {
        label: 'Total Supply in Profit',
    },
    percent_of_total_supply_in_profit: {
        label: 'Percent of Total Supply in Profit',
    },
}, (metric) => (metric.group = 'Network Value'));
export const DefiMetric = each({
    defi_total_value_locked_usd: {
        node: 'bar',
        label: 'Defi Total Value Locked in USD',
    },
}, (metric) => (metric.group = 'Defi'));
export const BeaconMetric = each({
    eth_beacon_deposits: {
        label: 'Beacon Chain Ether Deposits',
    },
    eth_beacon_validator_withdrawals: {
        label: 'Beacon Chain Validator Withdrawals - 32 ETH',
    },
    eth_beacon_reward_withdrawals: {
        label: 'Beacon Chain Validator Rewards Withdrawals',
    },
}, (metric) => (metric.group = 'Beacon'));
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
    fees_burnt_5m: {
        label: 'Ethereum Fees Burnt',
    },
    fees_burnt_usd_5m: {
        label: 'Ethereum Fees Burnt in USD',
        formatter: usdFormatter,
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
    metric.checkIsVisible = ({ slug }) => slug !== 'xrp' && slug !== 'ripple';
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
    total_supply: {
        label: 'Total Supply',
    },
    holders_distribution_total: {
        label: 'Total Amount Of Holders',
    },
    annual_inflation_rate: {
        label: 'Annual Inflation Rate',
    },
    gini_index: {
        label: 'Gini Index',
    },
    average_transfer_5m: {
        label: 'Average Transfer',
    },
    median_transfer_5m: {
        label: 'Median Transfer',
    },
    dex_amm_volume_in_xrp_5min: {
        label: 'XRPL DEX AMM Volume in XRP',
    },
    dex_amm_volume_in_usd_5min: {
        label: 'XRPL DEX AMM Volume in USD',
    },
    liquidity_in_amm_pools_by_pair: {
        label: 'Liquidity in XRPL AMM Pool by Pair',
    },
    liquidity_in_amm_pools_by_asset: {
        label: 'Liquidity in XRPL AMM Pool by Asset',
    },
}, XrpMetric, ContractAddressMetric, FeesMetric, Eth2Metric, AaveMetric, Aave3Metric, CompoundMetric, Compound3Metric, MakerDaoMetric, MakerDaoDsrMetric, SparkMetric, FluidMetric, MorphoMetric, LiquityMetric, FraxlendMetric, EthenaMetric, SkySavingsMetric, PendleMarketsMetric, BeaconMetric, NFTMetric, DefiMetric, HolderDistributionMetric, LongTermHoldersMetric, NetworkActivityMetric, NetworkValueMetric), (metric) => (metric.category = MetricCategory.OnChain));
//# sourceMappingURL=index.js.map