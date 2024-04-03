import { Node } from '@/Chart/nodes'
import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const MakerDaoMetric = each(
  {
    makerdao_action_deposits: {
      label: 'MakerDAO Deposits',
    },
    makerdao_action_deposits_usd: {
      label: 'MakerDAO Deposits in USD',
      formatter: usdFormatter,
    },
    makerdao_action_liquidations: {
      label: 'MakerDAO Liquidations',
    },
    makerdao_action_liquidations_usd: {
      label: 'MakerDAO Liquidations in USD',
      formatter: usdFormatter,
    },
    makerdao_action_new_debt: {
      label: 'MakerDAO New Debt',
    },
    makerdao_action_new_debt_usd: {
      label: 'MakerDAO New Debt in USD',
      formatter: usdFormatter,
    },
    dai_created: {
      label: 'MakerDAO New Debt Against Collateral',
    },
    makerdao_action_repayments: {
      label: 'MakerDAO Repayments',
    },
    makerdao_action_repayments_usd: {
      label: 'MakerDAO Repayments in USD',
      formatter: usdFormatter,
    },
    dai_repaid: {
      label: 'MakerDAO Repayments Against Collateral',
    },
    total_dai_created: {
      label: 'MakerDAO Total DAI Created Against Collateral',
      node: Node.LINE,
    },
    makerdao_total_supplied: {
      label: 'MakerDAO Collateral Total Supplied',
      node: Node.LINE,
    },
    makerdao_total_supplied_usd: {
      label: 'MakerDAO Collateral Total Supplied in USD',
      formatter: usdFormatter,
      node: Node.LINE,
    },
    makerdao_total_borrowed: {
      label: 'MakerDAO Total Borrowed',
      node: Node.LINE,
    },
    makerdao_total_borrowed_usd: {
      label: 'MakerDAO Total Borrowed in USD',
      formatter: usdFormatter,
      node: Node.LINE,
    },
    mcd_collat_ratio: {
      label: 'MakerDAO Collateralization Ratio',
    },
    mcd_stability_fee: {
      label: 'MakerDAO Stability Fee',
    },

    makerdao_total_deposits_usd: {
      label: 'MakerDAO Protocol Total Deposits in USD',
      formatter: usdFormatter,
    },
    makerdao_total_liquidations_usd: {
      label: 'MakerDAO Protocol Total Liquidations in USD',
      formatter: usdFormatter,
    },
    makerdao_total_new_debt_usd: {
      label: 'MakerDAO Protocol Total New Debt in USD',
      formatter: usdFormatter,
    },
    makerdao_total_repayments_usd: {
      label: 'MakerDAO Protocol Total Repayments in USD',
      formatter: usdFormatter,
    },
    makerdao_protocol_total_supplied_usd: {
      label: 'MakerDAO Protocol Total Supplied in USD',
      formatter: usdFormatter,
      node: Node.LINE,
    },
    makerdao_protocol_total_borrowed_usd: {
      label: 'MakerDAO Protocol Total Borrowed in USD',
      formatter: usdFormatter,
      node: Node.LINE,
    },
    makerdao_active_addresses: {
      label: 'MakerDAO Protocol Active Addresses',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Makerdao Stats'
    metric.node = metric.node || Node.BAR
  },
)

export const MakerDaoDsrMetric = each(
  {
    makerdao_dsr_deposits: {
      label: 'MakerDAO DSR (DAI Savings Rate) Deposits',
    },
    makerdao_dsr_withdrawals: {
      label: 'MakerDAO DSR (DAI Savings Rate) Withdrawals',
    },
    makerdao_dsr_total_supplied: {
      label: 'MakerDAO DSR (DAI Savings Rate) Total Supplied',
    },
    mcd_dsr: {
      label: 'MakerDAO DSR Rate',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'MakerDAO DSR'
  },
)
