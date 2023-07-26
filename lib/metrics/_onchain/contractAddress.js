import { Node } from './../../Chart/nodes.js';
import { each } from '../utils.js';
export const ContractAddressMetric = each({
    contract_transactions_count: {
        label: 'Contract Transactions Count',
    },
    contract_interacting_addresses_count: {
        label: 'Contract Interacting Addresses Count',
    },
}, (metric) => {
    metric.node = Node.BAR;
});
//# sourceMappingURL=contractAddress.js.map