import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const FraxlendMetric = each(
  {
    fraxlend_action_deposits: {
      label: 'Fraxlend Deposits',
    },
    fraxlend_action_deposits_usd: {
      label: 'Fraxlend Deposits in USD',
      formatter: usdFormatter,
    },
    fraxlend_action_liquidations: {
      label: 'Fraxlend Liquidations',
    },
    fraxlend_action_liquidations_usd: {
      label: 'Fraxlend Liquidations in USD',
      formatter: usdFormatter,
    },
    fraxlend_action_new_debt: {
      label: 'Fraxlend New Debt',
    },
    fraxlend_action_new_debt_usd: {
      label: 'Fraxlend New Debt in USD',
      formatter: usdFormatter,
    },
    fraxlend_action_repayments: {
      label: 'Fraxlend Repayments',
    },
    fraxlend_action_repayments_usd: {
      label: 'Fraxlend Repayments in USD',
      formatter: usdFormatter,
    },
    fraxlend_borrow_apy: {
      label: 'Fraxlend Borrow APY',
    },

    fraxlend_total_deposits_usd: {
      label: 'Fraxlend Protocol Total Deposits in USD',
      formatter: usdFormatter,
    },
    fraxlend_total_liquidations_usd: {
      label: 'Fraxlend Protocol Total Liquidations in USD',
      formatter: usdFormatter,
    },
    fraxlend_total_new_debt_usd: {
      label: 'Fraxlend Protocol Total New Debt in USD',
      formatter: usdFormatter,
    },
    fraxlend_total_repayments_usd: {
      label: 'Fraxlend Protocol Total Repayments in USD',
      formatter: usdFormatter,
    },
    fraxlend_active_addresses: {
      label: 'Fraxlend Protocol Active Addresses',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Fraxlend'
  },
)
