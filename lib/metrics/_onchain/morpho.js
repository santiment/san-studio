import { each } from '../utils.js';
import { usdFormatter } from '../formatters.js';
export const MorphoMetric = each({
    morpho_action_deposits: {
        label: 'Morpho Deposits',
        node: 'bar',
    },
    morpho_action_deposits_usd: {
        label: 'Morpho Deposits in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_action_liquidations: {
        label: 'Morpho Liquidations',
        node: 'bar',
    },
    morpho_action_liquidations_usd: {
        label: 'Morpho Liquidations in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_action_new_debt: {
        label: 'Morpho New Debt',
        node: 'bar',
    },
    morpho_action_new_debt_usd: {
        label: 'Morpho New Debt in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_action_repayments: {
        label: 'Morpho Repayments',
        node: 'bar',
    },
    morpho_action_repayments_usd: {
        label: 'Morpho Repayments in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_total_deposits_usd: {
        label: 'Morpho Protocol Total Deposits in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_total_liquidations_usd: {
        label: 'Morpho Protocol Total Liquidations in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_total_new_debt_usd: {
        label: 'Morpho Protocol Total New Debt in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_total_repayments_usd: {
        label: 'Morpho Protocol Total Repayments in USD',
        formatter: usdFormatter,
        node: 'bar',
    },
    morpho_active_addresses: {
        label: 'Morpho Protocol Active Addresses',
        node: 'bar',
    },
    morpho_vaults_total_supplied_usd: {
        label: 'Morpho Vaults Total Supplied in USD',
        formatter: usdFormatter,
    },
}, (metric) => {
    metric.group = 'Morpho';
});
//# sourceMappingURL=morpho.js.map