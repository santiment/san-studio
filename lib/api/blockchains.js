import { query } from 'san-webkit/lib/api';
import { capitalize } from 'san-webkit/lib/utils/formatting';
const AVAILABLE_BLOCKCHAINS_QUERY = `{
	getAvailableBlockchains {
    blockchain
    infrastructure
	}
}`;
const VALID_BLOCKCHAINS = new Set(['eth', 'bep20', 'polygon', 'avalanche']);
function precacher({ getAvailableBlockchains }) {
    getAvailableBlockchains.forEach((data) => {
        data.slug = data.blockchain;
        data.blockchain = data.blockchain.split('-').map(capitalize).join(' ');
    });
    return getAvailableBlockchains.filter(({ infrastructure }) => VALID_BLOCKCHAINS.has(infrastructure.toLowerCase()));
}
const options = { precacher: () => precacher };
export const queryAvailableBlockchains = () => query(AVAILABLE_BLOCKCHAINS_QUERY, options);
//# sourceMappingURL=blockchains.js.map