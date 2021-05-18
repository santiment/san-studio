import { HolderDistributionMetric } from './holderDistributions'
import { MetricCategory, MetricGroup } from '@/metrics/graph'
import { each } from '@/metrics/utils'
// import { Node } from '@/Chart/nodes'

const ExchangesMetric = each(
  {
    exchange_balance: {
      label: 'Exchange Flow Balance',
      shorthand: 'efb',
    },
    percent_of_total_supply_on_exchanges: {
      label: 'Supply on Exchanges (as % of total supply)',
    },
    active_deposits: {
      label: 'Daily Active Deposits',
      node: 'bar',
    },
    deposit_transactions: {
      label: 'Deposit Transactions',
    },
    withdrawal_transactions: {
      label: 'Withdrawal Transactions',
    },
    exchange_inflow: {
      label: 'Exchange Inflow',
    },
    exchange_outflow: {
      label: 'Exchange Outflow',
    },
    supply_on_exchanges: {
      label: 'Supply on Exchanges',
    },
    supply_outside_exchanges: {
      label: 'Supply outside of Exchanges',
    },
  },
  // (metric: Studio.Metric) => (metric.group = MetricGroup.TotalSentiment),
  (metric: Studio.Metric) => (metric.group = 'Exchanges'),
)

const WhalesMetric = each(
  {
    // topHoldersPercentOfTotalSupply: {
    //     label: 'Supply held by top addresses (as % of total supply)',
    // },
    whale_transaction_count_100k_usd_to_inf: {
      label: 'Whale Transaction Count (>100k USD)',
      node: 'bar',
    },
    whale_transaction_count_1m_usd_to_inf: {
      label: 'Whale Transaction Count (>1m USD)',
      node: 'bar',
    },
    amount_in_top_holders: {
      label: 'Supply held by top addresses',
    },
    amount_in_exchange_top_holders: {
      label: 'Supply held by top exchange addresses',
    },
    amount_in_non_exchange_top_holders: {
      label: 'Supply held by top non-exchange addresses',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Whales'),
)

const NetworkActivityMetric = each(
  {
    daily_active_addresses: {
      label: 'Daily Active Addresses',
      node: 'bar',
      shorthand: 'daa',
    },
    circulation: {
      label: 'Circulation',
    },
    transaction_volume: {
      label: 'Transaction Volume',
      node: 'bar',
    },
    transaction_volume_usd: {
      label: 'Transaction Volume USD',
      node: 'bar',
    },
    network_growth: {
      label: 'Network Growth',
    },
    velocity: {
      label: 'Velocity',
    },
    active_addresses_24h: {
      label: 'Active Addresses 24h',
      node: 'bar',
    },
    active_addresses_1h: {
      label: 'Active Addresses 1h',
      node: 'bar',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Network Activity'),
)

const LongTermHoldersMetric = each(
  {
    age_consumed: {
      label: 'Age Consumed',
      node: 'bar',
    },
    dormant_circulation: {
      label: 'Dormant Circulation',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Long-term holders'),
)

const NetworkValueMetric = each(
  {
    stock_to_flow: {
      label: 'Stock to Flow ratio',
    },
    mvrv_usd_z_score: {
      label: 'MVRV Ratio (Z score)',
      node: 'filledLine',
    },
    mvrv_usd: {
      label: 'MVRV ratio',
      node: 'filledLine',
    },
    mvrv_usd_intraday: {
      label: 'MVRV USD intraday',
    },
    mvrv_long_short_diff_usd: {
      label: 'MVRV Long/Short Difference',
    },
    realized_value_usd: {
      label: 'Realized Cap',
    },
    mean_dollar_invested_age: {
      label: 'Mean Dollar Invested Age',
    },
    mean_age: {
      label: 'Mean Coin Age',
    },
    nvt: {
      label: 'NVT Ratio (with Circulation)',
    },
    nvt_transaction_volume: {
      label: 'NVT Ratio (with Transaction Volume)',
    },
    network_profit_loss: {
      label: 'Network Realized Profit/Loss',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Network Value'),
)

export const OnChainMetric = each(
  Object.assign(
    {},
    ExchangesMetric,
    HolderDistributionMetric,
    WhalesMetric,
    NetworkActivityMetric,
    LongTermHoldersMetric,
    NetworkValueMetric,
  ),
  (metric: Studio.Metric) => (metric.category = MetricCategory.OnChain),
)
