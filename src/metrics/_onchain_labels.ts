import { queryTopHoldersPercentOfTatalSupply } from '@/api/timeseries/queries/topHoldersPercentOfTotalSupply'
import { MetricCategory, MetricGroup } from './graph'
import { each } from './utils'

const ExchangesMetrics = each(
  {
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
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.Exchanges),
)

export const TopHoldersMetrics = each(
  {
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
      getLabel: () =>
        'Percent of Stablecoin Total Supply held by Whales with more than 5 million USD',
      noProject: true,
      reqMeta: {
        slug: 'ethereum',
      },
    },
  },
  (metric: Studio.Metric) => (metric.group = MetricGroup.TopHolders),
)

export const OnChainLabelsMetrics = each(
  {
    ...ExchangesMetrics,
    ...TopHoldersMetrics,
  },
  (metric: Studio.Metric) => (metric.category = MetricCategory.OnChainLabels),
)