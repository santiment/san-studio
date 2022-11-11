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
  },
  (metric: Studio.Metric) => {
    metric.group = 'Aave'
  },
)
