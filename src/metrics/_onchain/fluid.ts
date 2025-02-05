import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const FluidMetric = each(
  {
    fluid_action_deposits: {
      label: 'Fluid Deposits',
      node: 'bar',
    },
    fluid_action_deposits_usd: {
      label: 'Fluid Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_action_liquidations: {
      label: 'Fluid Liquidations',
      node: 'bar',
    },
    fluid_action_liquidations_usd: {
      label: 'Fluid Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_action_new_debt: {
      label: 'Fluid New Debt',
      node: 'bar',
    },
    fluid_action_new_debt_usd: {
      label: 'Fluid New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_action_repayments: {
      label: 'Fluid Repayments',
      node: 'bar',
    },
    fluid_action_repayments_usd: {
      label: 'Fluid Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },

    fluid_total_deposits_usd: {
      label: 'Fluid Protocol Total Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_total_liquidations_usd: {
      label: 'Fluid Protocol Total Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_total_new_debt_usd: {
      label: 'Fluid Protocol Total New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_total_repayments_usd: {
      label: 'Fluid Protocol Total Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    fluid_active_addresses: {
      label: 'Fluid Protocol Active Addresses',
      node: 'bar',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Fluid'
  },
)
