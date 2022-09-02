import { query } from 'webkit/api'
import { capitalize } from 'webkit/utils/formatting'

const AVAILABLE_BLOCKCHAINS_QUERY = `{
	getAvailableBlockchains {
    blockchain
    infrastructure
	}
}`

type Blockchain = {
  blockchain: string
  infrastructure: string
  slug?: string
}

type Query = SAN.API.Query<'getAvailableBlockchains', Blockchain[]>

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

function precacher({ getAvailableBlockchains }: Query) {
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

const options = { precacher: () => precacher } as any

export const queryAvailableBlockchains = (): Promise<Blockchain[]> =>
  query<Query>(AVAILABLE_BLOCKCHAINS_QUERY, options) as any as Promise<Blockchain[]>
