import { each } from '../utils';
import { usdFormatter } from '../formatters';
export const CompoundMetric = each({
    compound_action_deposits: {
        label: 'Compound Deposits',
    },
    compound_action_liquidations: {
        label: 'Compound Liquidations',
    },
    compound_action_new_debt: {
        label: 'Compound New Debt',
    },
    compound_action_repayments: {
        label: 'Compound Repayments',
    },
    compound_total_supplied: {
        label: 'Compound Total Supplied',
    },
    compound_total_borrowed: {
        label: 'Compound Total Borrowed',
    },
    compound_action_deposits_usd: {
        label: 'Compound Deposits in USD',
        formatter: usdFormatter,
    },
    compound_action_liquidations_usd: {
        label: 'Compound Liquidations in USD',
        formatter: usdFormatter,
    },
    compound_action_new_debt_usd: {
        label: 'Compound New Debt in USD',
        formatter: usdFormatter,
    },
    compound_action_repayments_usd: {
        label: 'Compound Repayments in USD',
        formatter: usdFormatter,
    },
    compound_total_deposits_usd: {
        label: 'Compound Total Deposits in USD',
        formatter: usdFormatter,
    },
    compound_total_liquidations_usd: {
        label: 'Compound Total Liquidations in USD',
        formatter: usdFormatter,
    },
    compound_total_new_debt_usd: {
        label: 'Compound Total New Debt in USD',
        formatter: usdFormatter,
    },
    compound_total_repayments_usd: {
        label: 'Compound Total Repayments in USD',
        formatter: usdFormatter,
    },
    compound_total_supplied_usd: {
        label: 'Compound Total Supplied in USD',
        formatter: usdFormatter,
    },
    compound_total_borrowed_usd: {
        label: 'Compound Total Borrowed in USD',
        formatter: usdFormatter,
    },
    compound_protocol_total_supplied_usd: {
        label: 'Compound Protocol Total Supplied in USD',
        formatter: usdFormatter,
    },
    compound_protocol_total_borrowed_usd: {
        label: 'Compound Protocol Total Borrowed in USD',
        formatter: usdFormatter,
    },
}, (metric) => {
    metric.group = 'Compound';
});
//# sourceMappingURL=compound.js.map