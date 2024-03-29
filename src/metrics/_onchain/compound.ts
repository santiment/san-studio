import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const CompoundMetric = each(
  {
    compound_action_deposits: {
      label: 'Compound Deposits',
    },
    compound_action_liquidations: {
      label: 'Compound Liquidations',
    },
    compound_action_new_debt: {
      label: 'Compound New Debt',
    },
    compound_action_repayments: {
      label: 'Compound Repayments',
    },
    compound_total_supplied: {
      label: 'Compound Total Supplied',
    },
    compound_total_borrowed: {
      label: 'Compound Total Borrowed',
    },

    compound_action_deposits_usd: {
      label: 'Compound Deposits in USD',
      formatter: usdFormatter,
    },
    compound_action_liquidations_usd: {
      label: 'Compound Liquidations in USD',
      formatter: usdFormatter,
    },
    compound_action_new_debt_usd: {
      label: 'Compound New Debt in USD',
      formatter: usdFormatter,
    },
    compound_action_repayments_usd: {
      label: 'Compound Repayments in USD',
      formatter: usdFormatter,
    },
    compound_total_deposits_usd: {
      label: 'Compound Total Deposits in USD',
      formatter: usdFormatter,
    },
    compound_total_liquidations_usd: {
      label: 'Compound Total Liquidations in USD',
      formatter: usdFormatter,
    },
    compound_total_new_debt_usd: {
      label: 'Compound Total New Debt in USD',
      formatter: usdFormatter,
    },
    compound_total_repayments_usd: {
      label: 'Compound Total Repayments in USD',
      formatter: usdFormatter,
    },
    compound_total_supplied_usd: {
      label: 'Compound Total Supplied in USD',
      formatter: usdFormatter,
    },
    compound_total_borrowed_usd: {
      label: 'Compound Total Borrowed in USD',
      formatter: usdFormatter,
    },
    compound_protocol_total_supplied_usd: {
      label: 'Compound Protocol Total Supplied in USD',
      formatter: usdFormatter,
    },
    compound_protocol_total_borrowed_usd: {
      label: 'Compound Protocol Total Borrowed in USD',
      formatter: usdFormatter,
    },

    compound_supply_apy: {
      label: 'Compound Supply APY',
    },
    compound_borrow_apy: {
      label: 'Compound Borrow APY',
    },

    compound_active_addresses: {
      label: 'Compound Active Addresses',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Compound'
  },
)

export const Compound3Metric = each(
  {
    compound_v3_action_deposits: {
      label: 'Compound v3 Deposits',
    },
    compound_v3_action_liquidations: {
      label: 'Compound v3 Liquidations',
    },
    compound_v3_action_new_debt: {
      label: 'Compound v3 New Debt',
    },
    compound_v3_action_repayments: {
      label: 'Compound v3 Repayments',
    },
    compound_v3_action_deposits_usd: {
      label: 'Compound v3 Deposits in USD',
      formatter: usdFormatter,
    },
    compound_v3_action_liquidations_usd: {
      label: 'Compound v3 Liquidations in USD',
      formatter: usdFormatter,
    },
    compound_v3_action_new_debt_usd: {
      label: 'Compound v3 New Debt in USD',
      formatter: usdFormatter,
    },
    compound_v3_action_repayments_usd: {
      label: 'Compound v3 Repayments in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_deposits_usd: {
      label: 'Compound v3 Total Deposits in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_liquidations_usd: {
      label: 'Compound v3 Total Liquidations in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_new_debt_usd: {
      label: 'Compound v3 Total New Debt in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_repayments_usd: {
      label: 'Compound v3 Total Repayments in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_supplied: {
      label: 'Compound v3 Total Supplied',
    },
    compound_v3_total_supplied_usd: {
      label: 'Compound v3 Total Supplied in USD',
      formatter: usdFormatter,
    },
    compound_v3_total_borrowed: {
      label: 'Compound v3 Total Borrowed',
    },
    compound_v3_total_borrowed_usd: {
      label: 'Compound v3 Total Borrowed in USD',
      formatter: usdFormatter,
    },
    compound_v3_protocol_total_supplied_usd: {
      label: 'Compound v3 Protocol Total Supplied in USD',
      formatter: usdFormatter,
    },
    compound_v3_protocol_total_borrowed_usd: {
      label: 'Compound v3 Protocol Total Borrowed in USD',
      formatter: usdFormatter,
    },
    compound_v3_eth_market_supply_apy: {
      label: 'Compound v3 ETH market supply APY',
    },
    compound_v3_eth_market_borrow_apy: {
      label: 'Compound v3 ETH market borrow APY',
    },
    compound_v3_usdc_market_supply_apy: {
      label: 'Compound v3 USDC market supply APY',
    },
    compound_v3_usdc_market_borrow_apy: {
      label: 'Compound v3 USDC market borrow APY',
    },
    compound_v3_active_addresses: {
      label: 'Compound v3 Active Addresses',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Compound v3'
  },
)
