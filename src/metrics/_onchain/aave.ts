import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const AaveMetric = each(
  {
    aave_v2_action_deposits: {
      label: 'Aave v2 Deposits',
    },
    aave_v2_action_deposits_usd: {
      label: 'Aave v2 Deposits in USD',
      formatter: usdFormatter,
    },
    aave_v2_action_liquidations: {
      label: 'Aave v2 Liquidations',
    },
    aave_v2_action_liquidations_usd: {
      label: 'Aave v2 Liquidations in USD',
      formatter: usdFormatter,
    },
    aave_v2_action_new_debt: {
      label: 'Aave v2 New Debt',
    },
    aave_v2_action_new_debt_usd: {
      label: 'Aave v2 New Debt in USD',
      formatter: usdFormatter,
    },
    aave_v2_action_repayments: {
      label: 'Aave v2 Repayments',
    },
    aave_v2_action_repayments_usd: {
      label: 'Aave v2 Repayments in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_supplied: {
      label: 'Aave v2 Total Supplied',
    },
    aave_v2_total_supplied_usd: {
      label: 'Aave v2 Total Supplied in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_borrowed: {
      label: 'Aave v2 Total Borrowed',
    },
    aave_v2_total_borrowed_usd: {
      label: 'Aave v2 Total Borrowed in USD',
      formatter: usdFormatter,
    },

    aave_v2_supply_apy: {
      label: 'Aave v2 Supply APY',
    },
    aave_v2_stable_borrow_apy: {
      label: 'Aave v2 Stable Borrow APY',
    },
    aave_v2_variable_borrow_apy: {
      label: 'Aave v2 Variable Borrow APY',
    },
    aave_v2_revenue: {
      label: 'Aave v2 Revenue',
      node: 'bar',
    },
    aave_v2_revenue_usd: {
      label: 'Aave v2 Revenue in USD',
      formatter: usdFormatter,
      node: 'bar',
    },

    aave_v2_total_deposits_usd: {
      label: 'Aave v2 Protocol Total Deposits in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_liquidations_usd: {
      label: 'Aave v2 Protocol Total Liquidations in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_new_debt_usd: {
      label: 'Aave v2 Protocol Total New Debt in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_repayments_usd: {
      label: 'Aave v2 Protocol Total Repayments in USD',
      formatter: usdFormatter,
    },
    aave_v2_protocol_total_supplied_usd: {
      label: 'Aave v2 Protocol Total Supplied in USD',
      formatter: usdFormatter,
    },
    aave_v2_protocol_total_borrowed_usd: {
      label: 'Aave v2 Protocol Total Borrowed in USD',
      formatter: usdFormatter,
    },
    aave_v2_active_addresses: {
      label: 'Aave v2 Protocol Active Addresses',
    },
    aave_v2_total_protocol_revenue_usd: {
      label: 'Aave v2 Protocol Total Revenue in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    aave_v2_total_protocol_cumulative_revenue_usd: {
      label: 'Aave v2 Protocol Total Cumulative Revenue in USD',
      formatter: usdFormatter,
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Aave v2'
  },
)

export const Aave3Metric = each(
  {
    aave_v3_action_deposits: {
      label: 'Aave v3 Deposits',
    },
    aave_v3_action_deposits_usd: {
      label: 'Aave v3 Deposits in USD',
      formatter: usdFormatter,
    },
    aave_v3_action_liquidations: {
      label: 'Aave v3 Liquidations',
    },
    aave_v3_action_liquidations_usd: {
      label: 'Aave v3 Liquidations in USD',
      formatter: usdFormatter,
    },
    aave_v3_action_new_debt: {
      label: 'Aave v3 New Debt',
    },
    aave_v3_action_new_debt_usd: {
      label: 'Aave v3 New Debt in USD',
      formatter: usdFormatter,
    },
    aave_v3_action_repayments: {
      label: 'Aave v3 Repayments',
    },
    aave_v3_action_repayments_usd: {
      label: 'Aave v3 Repayments in USD',
      formatter: usdFormatter,
    },
    aave_v3_total_supplied: {
      label: 'Aave v3 Total Supplied',
    },
    aave_v3_total_supplied_usd: {
      label: 'Aave v3 Total Supplied in USD',
      formatter: usdFormatter,
    },
    aave_v3_total_borrowed: {
      label: 'Aave v3 Total Borrowed',
    },
    aave_v3_total_borrowed_usd: {
      label: 'Aave v3 Total Borrowed in USD',
      formatter: usdFormatter,
    },
    aave_v3_supply_apy: {
      label: 'Aave v3 Supply APY',
    },
    aave_v3_variable_borrow_apy: {
      label: 'Aave v3 Variable Borrow APY',
    },
    aave_v3_revenue: {
      label: 'Aave v3 Revenue',
      node: 'bar',
    },
    aave_v3_revenue_usd: {
      label: 'Aave v3 Revenue in USD',
      formatter: usdFormatter,
      node: 'bar',
    },

    aave_v3_total_deposits_usd: {
      label: 'Aave v3 Protocol Total Deposits in USD',
      formatter: usdFormatter,
    },
    aave_v3_total_liquidations_usd: {
      label: 'Aave v3 Protocol Total Liquidations in USD',
      formatter: usdFormatter,
    },
    aave_v3_total_new_debt_usd: {
      label: 'Aave v3 Protocol Total New Debt in USD',
      formatter: usdFormatter,
    },
    aave_v3_total_repayments_usd: {
      label: 'Aave v3 Protocol Total Repayments in USD',
      formatter: usdFormatter,
    },
    aave_v3_protocol_total_supplied_usd: {
      label: 'Aave v3 Protocol Total Supplied in USD',
      formatter: usdFormatter,
    },
    aave_v3_protocol_total_borrowed_usd: {
      label: 'Aave v3 Protocol Total Borrowed in USD',
      formatter: usdFormatter,
    },
    aave_v3_active_addresses: {
      label: 'Aave v3 Protocol Active Addresses',
    },
    aave_v3_total_protocol_revenue_usd: {
      label: 'Aave v3 Protocol Total Revenue in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    aave_v3_total_protocol_cumulative_revenue_usd: {
      label: 'Aave v3 Protocol Total Cumulative Revenue in USD',
      formatter: usdFormatter,
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Aave v3'
  },
)
