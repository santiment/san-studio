import { query } from 'san-webkit/lib/api'
import { capitalize } from 'san-webkit/lib/utils/formatting'
const AVAILABLE_BLOCKCHAINS_QUERY = `{
	getAvailableBlockchains {
    blockchain
    infrastructure
	}
}`
const VALID_BLOCKCHAINS = new Set([
  'btc',
  'eth',
  'bep20',
  'ripple',
  'cardano',
  'doge',
  'polygon',
  'avalanche',
  'ltc',
  'bch',
  'optimism',
])
const BLOCKCHAINS_ORDER = [...VALID_BLOCKCHAINS]
export const BLOCKCHAINS_NAMES = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  bep20: 'BNB Chain',
  ripple: 'Ripple',
  cardano: 'Cardano',
  doge: 'Dogecoin',
  polygon: 'Polygon',
  avalanche: 'Avalanche',
  ltc: 'Litecoin',
  bch: 'Bitcoin Cash',
  optimism: 'Optimism',
}
function precacher({ getAvailableBlockchains }) {
  getAvailableBlockchains.forEach((data) => {
    data.slug = data.blockchain
    data.blockchain = data.blockchain.split('-').map(capitalize).join(' ')
  })
  return getAvailableBlockchains
    .filter(({ infrastructure }) => VALID_BLOCKCHAINS.has(infrastructure.toLowerCase()))
    .sort(function (a, b) {
      return (
        BLOCKCHAINS_ORDER.indexOf(a.infrastructure.toLowerCase()) -
        BLOCKCHAINS_ORDER.indexOf(b.infrastructure.toLowerCase())
      )
    })
}
const options = { precacher: () => precacher }
export const queryAvailableBlockchains = () => query(AVAILABLE_BLOCKCHAINS_QUERY, options)
//# sourceMappingURL=blockchains.js.map
