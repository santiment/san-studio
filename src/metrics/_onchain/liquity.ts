import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const LiquityMetric = each(
  {
    liquity_action_deposits: {
      label: 'Liquity Deposits',
      node: 'bar',
    },
    liquity_action_deposits_usd: {
      label: 'Liquity Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    liquity_action_liquidations: {
      label: 'Liquity Liquidations',
      node: 'bar',
    },
    liquity_action_liquidations_usd: {
      label: 'Liquity Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    liquity_action_new_debt: {
      label: 'Liquity New Debt',
      node: 'bar',
    },
    liquity_action_new_debt_usd: {
      label: 'Liquity New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    liquity_action_repayments: {
      label: 'Liquity Repayments',
      node: 'bar',
    },
    liquity_action_repayments_usd: {
      label: 'Liquity Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    liquity_total_supplied: {
      label: 'Liquity Total Supplied',
    },
    liquity_total_supplied_usd: {
      label: 'Liquity Total Supplied in USD',
      formatter: usdFormatter,
    },
    liquity_total_borrowed: {
      label: 'Liquity Total Borrowed',
    },
    liquity_total_borrowed_usd: {
      label: 'Liquity Total Borrowed in USD',
      formatter: usdFormatter,
    },
    liquity_borrow_fee: {
      label: 'Liquity Borrow Fee',
    },
    liquity_active_addresses: {
      label: 'Liquity Protocol Active Addresses',
      node: 'bar',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Liquity'
  },
)
