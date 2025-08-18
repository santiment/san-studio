import { Node } from './../../Chart/nodes.js';
import { each } from '../utils.js';
export const CrvUSDSavingsMetric = each({
    crvusd_savings_total_supplied: {
        label: 'crvUSD Savings Total Supplied',
        node: Node.LINE,
    },
    crvusd_savings_distributions: {
        label: 'crvUSD Savings Distributions',
        node: 'bar',
    },
    crvusd_savings_apy: {
        label: 'crvUSD Savings APY',
        node: Node.LINE,
    },
}, (metric) => {
    metric.group = 'crvUSD Savings';
    metric.node = metric.node || Node.BAR;
});
//# sourceMappingURL=crvusdSavings.js.map