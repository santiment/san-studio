import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const AaveMetric = each(
  {
    aave_v2_action_deposits: {
      label: 'Aave v2 Deposits',
    },

    aave_v2_action_liquidations: {
      label: 'Aave v2 Liquidations',
    },

    aave_v2_action_new_debt: {
      label: 'Aave v2 New Debt',
    },

    aave_v2_action_repayments: {
      label: 'Aave v2 Repayments',
    },

    aave_v2_total_supplied: {
      label: 'Aave v2 Total Supplied',
    },
    aave_v2_total_borrowed: {
      label: 'Aave v2 Total Borrowed',
    },

    aave_v2_action_deposits_usd: {
      label: 'Aave v2 Deposits in USD',
      formatter: usdFormatter,
    },

    aave_v2_action_liquidations_usd: {
      label: 'Aave v2 Liquidations in USD',
      formatter: usdFormatter,
    },

    aave_v2_action_new_debt_usd: {
      label: 'Aave v2 New Debt in USD',
      formatter: usdFormatter,
    },

    aave_v2_action_repayments_usd: {
      label: 'Aave v2 Repayments in USD',
      formatter: usdFormatter,
    },

    aave_v2_total_deposits_usd: {
      label: 'Aave v2 Total Deposits in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_liquidations_usd: {
      label: 'Aave v2 Total Liquidations in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_new_debt_usd: {
      label: 'Aave v2 Total New Debt in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_repayments_usd: {
      label: 'Aave v2 Total Repayments in USD',
      formatter: usdFormatter,
    },
    aave_v2_total_supplied_usd: {
      label: 'Aave v2 Total Supplied in USD',
      formatter: usdFormatter,
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
  },
  (metric: Studio.Metric) => {
    metric.group = 'Aave'
  },
)
