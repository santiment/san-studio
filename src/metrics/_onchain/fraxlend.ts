import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const FraxlendMetric = each(
  {
    fraxlend_action_deposits: {
      label: 'Fraxlend Deposits',
      node: 'bar',
    },
    fraxlend_action_deposits_usd: {
      label: 'Fraxlend Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_action_liquidations: {
      label: 'Fraxlend Liquidations',
      node: 'bar',
    },
    fraxlend_action_liquidations_usd: {
      label: 'Fraxlend Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_action_new_debt: {
      label: 'Fraxlend New Debt',
      node: 'bar',
    },
    fraxlend_action_new_debt_usd: {
      label: 'Fraxlend New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_action_repayments: {
      label: 'Fraxlend Repayments',
      node: 'bar',
    },
    fraxlend_action_repayments_usd: {
      label: 'Fraxlend Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_total_supplied: {
      label: 'Fraxlend Total Supplied',
    },
    fraxlend_total_supplied_usd: {
      label: 'Fraxlend Total Supplied in USD',
      formatter: usdFormatter,
    },
    fraxlend_total_borrowed_against_collateral: {
      label: 'Fraxlend Total FRAX Borrowed Against Collateral',
    },
    fraxlend_borrow_apy: {
      label: 'Fraxlend Borrow APY',
    },

    fraxlend_total_deposits_usd: {
      label: 'Fraxlend Protocol Total Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_total_liquidations_usd: {
      label: 'Fraxlend Protocol Total Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_total_new_debt_usd: {
      label: 'Fraxlend Protocol Total New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_total_repayments_usd: {
      label: 'Fraxlend Protocol Total Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fraxlend_protocol_total_supplied_usd: {
      label: 'Fraxlend Protocol Total Supplied in USD',
      formatter: usdFormatter,
    },
    fraxlend_protocol_total_borrowed_usd: {
      label: 'Fraxlend Protocol Total Borrowed in USD',
      formatter: usdFormatter,
    },
    fraxlend_active_addresses: {
      label: 'Fraxlend Protocol Active Addresses',
      node: 'bar',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Fraxlend'
  },
)
