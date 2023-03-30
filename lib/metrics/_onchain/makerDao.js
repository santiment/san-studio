import { Node } from './../../../lib/Chart/nodes';
import { each } from '../utils';
export const MakerDaoMetric = each({
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
    },
    makerdao_action_liquidations_usd: {
        label: 'MakerDAO Liquidations in USD',
    },
    makerdao_action_new_debt_usd: {
        label: 'MakerDAO New Debt in USD',
    },
    makerdao_action_repayments_usd: {
        label: 'MakerDAO Repayments in USD',
    },
    makerdao_total_deposits_usd: {
        label: 'MakerDAO Total Deposits in USD',
    },
    makerdao_total_liquidations_usd: {
        label: 'MakerDAO Total Liquidations in USD',
    },
    makerdao_total_new_debt_usd: {
        label: 'MakerDAO Total New Debt in USD',
    },
    makerdao_total_repayments_usd: {
        label: 'MakerDAO Total Repayments in USD',
    },
    makerdao_total_supplied: {
        label: 'MakerDAO Total Supplied',
        node: Node.LINE,
    },
    makerdao_total_supplied_usd: {
        label: 'MakerDAO Total Supplied in USD',
        node: Node.LINE,
    },
    makerdao_total_borrowed: {
        label: 'MakerDAO Total Borrowed',
        node: Node.LINE,
    },
    makerdao_total_borrowed_usd: {
        label: 'MakerDAO Total Borrowed in USD',
        node: Node.LINE,
    },
    makerdao_protocol_total_supplied_usd: {
        label: 'MakerDAO Protocol Total Supplied in USD',
        node: Node.LINE,
    },
    makerdao_protocol_total_borrowed_usd: {
        label: 'MakerDAO Protocol Total Borrowed in USD',
        node: Node.LINE,
    },
}, (metric) => {
    metric.group = 'Makerdao Stats';
    metric.node = metric.node || Node.BAR;
});
//# sourceMappingURL=makerDao.js.map