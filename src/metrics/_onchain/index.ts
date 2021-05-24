import { HolderDistributionMetric } from './holderDistributions'
import { MetricCategory, MetricGroup } from '@/metrics/graph'
import { each } from '@/metrics/utils'
import { mvrvFormatter, ratioPercentAxisFormatter } from '@/metrics/formatters'
import { queryGasUsed } from '@/api/timeseries/queries/gasUsed'
import { mvrvPrecacher } from '@/api/timeseries/queries/mvrv'
import { queryEthSpentOverTime } from '@/api/timeseries/queries/ethSpentOverTime'
import { queryTopHoldersPercentOfTatalSupply } from '@/api/timeseries/queries/topHoldersPercentOfTotalSupply'

const ExchangesMetric = each(
  {
    active_deposits: {
      label: 'Daily Active Deposits',
      node: 'bar',
    },
    deposit_transactions: {
      label: 'Deposit Transactions',
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
    },
  },
  // (metric: Studio.Metric) => (metric.group = MetricGroup.TotalSentiment),
  (metric: Studio.Metric) => (metric.group = 'Exchanges'),
)

const WhalesMetric = each(
  {
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
  },
  (metric: Studio.Metric) => (metric.group = 'Whales'),
)

const NetworkActivityMetric = each(
  {
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
    velocity: {
      label: 'Velocity',
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
    dormant_circulation_365d: {
      label: 'Dormant Circulation (365d)',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Long-term holders'),
)

const NetworkValueMetric = each(
  {
    mean_age: {
      label: 'Mean Coin Age',
    },
    mean_dollar_invested_age: {
      label: 'Mean Dollar Invested Age',
    },
    mvrv_long_short_diff_usd: {
      label: 'MVRV Long/Short Difference',
      formatter: mvrvFormatter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    mvrv_usd: {
      label: 'MVRV ratio',
      node: 'filledLine',
      formatter: mvrvFormatter,
      axisFormatter: ratioPercentAxisFormatter,
      precacher: mvrvPrecacher,
    },
    mvrv_usd_intraday: {
      label: 'MVRV USD intraday',
      formatter: mvrvFormatter,
      axisFormatter: ratioPercentAxisFormatter,
    },
    mvrv_usd_z_score: {
      label: 'MVRV Ratio (Z score)',
      node: 'filledLine',
    },
    network_profit_loss: {
      label: 'Network Realized Profit/Loss',
    },
    nvt: {
      label: 'NVT Ratio (with Circulation)',
    },
    nvt_transaction_volume: {
      label: 'NVT Ratio (with Transaction Volume)',
    },
    realized_value_usd: {
      label: 'Realized Cap',
    },
    stock_to_flow: {
      label: 'Stock to Flow ratio',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Network Value'),
)

export const DefiMetric = each(
  {
    defi_total_value_locked_usd: {
      node: 'bar',
      label: 'Defi Total Value Locked in USD',
    },
  },
  (metric: Studio.Metric) => (metric.group = 'Defi'),
)

export const OnChainMetric = each(
  Object.assign(
    {
      ethSpentOverTime: {
        label: 'Eth Spent Over Time',
        fetch: queryEthSpentOverTime,
      },
      gasUsed: {
        label: 'Gas Used',
        fetch: queryGasUsed,
      },
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
      miners_balance: {
        label: 'Miners Balance',
        category: 'On-chain',
      },
    },

    ExchangesMetric,
    DefiMetric,
    HolderDistributionMetric,
    WhalesMetric,
    LongTermHoldersMetric,
    NetworkActivityMetric,
    NetworkValueMetric,
  ),
  (metric: Studio.Metric) => (metric.category = MetricCategory.OnChain),
)
