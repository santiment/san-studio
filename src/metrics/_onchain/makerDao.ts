import { Node } from '@/Chart/nodes'
import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const MakerDaoMetric = each(
  {
    mcd_locked_token: {
      label: 'Token Locked in Multi-Collateral CDPs',
    },
    scd_locked_token: {
      label: 'WETH Locked in Single-Collateral CDPs',
    },
    mcd_collat_ratio: {
      label: 'Collateralization Ratio for BAT and USDC in Multi-Collateral CDPs',
    },
    mcd_collat_ratio_weth: {
      label: 'Collateralization Ratio for WETH in Multi-Collateral CDPs',
    },
    mcd_collat_ratio_sai: {
      label: 'Collateralization Ratio for SAI in Multi-Collateral CDPs',
    },
    scd_collat_ratio: {
      label: 'Collateralization Ratio for Single-Collateral CDPs',
    },
    mcd_dsr: {
      label: 'Multi-Collateral DAI in DSR Saving Annual Rate',
    },
    mcd_stability_fee: {
      label: 'Multi-Collateral Stability Fee',
    },
    dai_created: {
      label: 'Multi-Collateral DAI Created',
    },
    dai_repaid: {
      label: 'Multi-Collateral DAI Repaid',
    },
    mcd_liquidation: {
      label: 'Makerdao Collateral Liquidation Amounts',
    },
    total_dai_created: {
      label: 'Total Multi-Collateral DAI Created',
    },

    makerdao_action_deposits: {
      label: 'MakerDAO Deposits',
    },
    makerdao_action_liquidations: {
      label: 'MakerDAO Liquidations',
    },
    makerdao_action_new_debt: {
      label: 'MakerDAO New Debt',
    },
    makerdao_action_repayments: {
      label: 'MakerDAO Repayments',
    },
    makerdao_action_deposits_usd: {
      label: 'MakerDAO Deposits in USD',
      formatter: usdFormatter,
    },
    makerdao_action_liquidations_usd: {
      label: 'MakerDAO Liquidations in USD',
      formatter: usdFormatter,
    },
    makerdao_action_new_debt_usd: {
      label: 'MakerDAO New Debt in USD',
      formatter: usdFormatter,
    },
    makerdao_action_repayments_usd: {
      label: 'MakerDAO Repayments in USD',
      formatter: usdFormatter,
    },
    makerdao_total_deposits_usd: {
      label: 'MakerDAO Total Deposits in USD',
      formatter: usdFormatter,
    },
    makerdao_total_liquidations_usd: {
      label: 'MakerDAO Total Liquidations in USD',
      formatter: usdFormatter,
    },
    makerdao_total_new_debt_usd: {
      label: 'MakerDAO Total New Debt in USD',
      formatter: usdFormatter,
    },
    makerdao_total_repayments_usd: {
      label: 'MakerDAO Total Repayments in USD',
      formatter: usdFormatter,
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
      label: 'MakerDAO Active Addresses',
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
      label: 'MakerDAO DSR Deposits',
    },
    makerdao_dsr_withdrawals: {
      label: 'MakerDAO DSR Withdrawals',
    },
    makerdao_dsr_total_supplied: {
      label: 'MakerDAO DSR Total Supplied',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'MakerDAO DSR'
  },
)
