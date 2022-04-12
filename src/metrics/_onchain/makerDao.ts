import { Node } from '@/Chart/nodes'
import { each } from '../utils'

export const MakerDaoMetric = each(
  {
    mcd_locked_token: {
      label: 'Token Locked in Multi-Collateral CDPs',
    },
    scd_locked_token: {
      label: 'WETH Locked in Single-Collateral CDPs',
    },
    mcd_supply: {
      label: 'Multi-Collateral DAI Total Supply',
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
  },
  (metric: Studio.Metric) => {
    metric.group = 'Makerdao Stats'
    metric.node = Node.BAR
  },
)
