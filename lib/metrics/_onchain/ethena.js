import { Node } from './../../Chart/nodes.js';
import { each } from '../utils.js';
export const EthenaMetric = each({
    ethena_staking_deposits: {
        label: 'Ethena Staking Deposits',
        node: 'bar',
    },
    ethena_staking_withdrawals: {
        label: 'Ethena Staking Withdrawals',
        node: 'bar',
    },
    ethena_staking_apy: {
        label: 'Ethena Staking APY',
    },
}, (metric) => {
    metric.group = 'Ethena Staking';
    metric.node = metric.node || Node.BAR;
});
//# sourceMappingURL=ethena.js.map