import { each } from './../../lib/metrics/utils';
import { query } from 'san-webkit/lib/api';
const AVAILABLE_BLOCKCHAINS_QUERY = `{
	getAvailableBlockchains {
    slug
    infrastructure
	}
}`;
export const Blockchain = each({
    BTC: { slug: 'bitcoin', name: 'Bitcoin' },
    ETH: { slug: 'ethereum', name: 'Ethereum' },
    BEP20: { slug: 'binance-coin', name: 'BNB Chain' },
    Ripple: { slug: 'ripple', name: 'Ripple' },
    Cardano: { slug: 'cardano', name: 'Cardano' },
    DOGE: { slug: 'dogecoin', name: 'Dogecoin' },
    Polygon: { slug: 'matic-network', name: 'Polygon' },
    Avalanche: { slug: 'avalanche', name: 'Avalanche' },
    Arbitrum: {
        slug: 'arbitrum',
        name: 'Arbitrum',
    },
    LTC: { slug: 'litecoin', name: 'Litecoin' },
    BCH: { slug: 'bitcoin-cash', name: 'Bitcoin Cash' },
    Optimism: { slug: 'optimism-ethereum', name: 'Optimism' },
}, (blockchain, infrastructure) => {
    blockchain.infrastructure = infrastructure;
});
function precacher() {
    return Object.values(Blockchain);
}
const options = { precacher: () => precacher };
export const queryAvailableBlockchains = () => query(AVAILABLE_BLOCKCHAINS_QUERY, options);
/// -----------------
const ALL_PROJECTS = `{
    allProjects(minVolume:0){
      slug
      infrastructure
    }
  }`;
function projectBlockchainPrecacher({ allProjects }) {
    const data = {};
    allProjects.forEach(({ slug, infrastructure }) => {
        if (infrastructure === 'own') {
            data[slug] = slug;
            return;
        }
        const blockchain = Blockchain[infrastructure];
        if (blockchain)
            data[slug] = blockchain.slug;
    });
    return data;
}
const projectBlockchainOptions = { precacher: () => projectBlockchainPrecacher };
export const queryProjectBlockchain = (slug) => query(ALL_PROJECTS, projectBlockchainOptions).then((data) => data[slug]);
//# sourceMappingURL=blockchains.js.map