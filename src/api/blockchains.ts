import { each } from '@/metrics/utils'
import { query } from 'webkit/api'

const AVAILABLE_BLOCKCHAINS_QUERY = `{
	getAvailableBlockchains {
    slug
    infrastructure
	}
}`

type Blockchain = {
  infrastructure: string
  slug: string
  name: string
}

type Query = SAN.API.Query<'getAvailableBlockchains', Blockchain[]>

export const Blockchain = each(
  {
    BTC: { slug: 'bitcoin', name: 'Bitcoin' },
    ETH: { slug: 'ethereum', name: 'Ethereum' },
    BEP20: { slug: 'binance-coin', name: 'BNB Chain' },
    Ripple: { slug: 'ripple', name: 'Ripple' },
    Cardano: { slug: 'cardano', name: 'Cardano' },
    DOGE: { slug: 'dogecoin', name: 'Dogecoin' },
    Polygon: { slug: 'matic-network', name: 'Polygon' },
    Avalanche: { slug: 'avalanche', name: 'Avalanche' },
    Arbitrum: { slug: 'arbitrum', name: 'Arbitrum' },
    LTC: { slug: 'litecoin', name: 'Litecoin' },
    BCH: { slug: 'bitcoin-cash', name: 'Bitcoin Cash' },
    Optimism: { slug: 'optimism-ethereum', name: 'Optimism' },
  },
  (blockchain: any, infrastructure) => {
    blockchain.infrastructure = infrastructure
  },
)

function precacher() {
  return Object.values(Blockchain)
}

const options = { precacher: () => precacher } as any

export const queryAvailableBlockchains = (): Promise<Blockchain[]> =>
  query<Query>(AVAILABLE_BLOCKCHAINS_QUERY, options) as any as Promise<Blockchain[]>

/// -----------------

const ALL_PROJECTS = `{
    allProjects(minVolume:0){
      slug
      infrastructure
    }
  }`

function projectBlockchainPrecacher({ allProjects }) {
  const data = {}
  allProjects.forEach(({ slug, infrastructure }) => {
    if (infrastructure === 'own') {
      data[slug] = slug
      return
    }

    const blockchain = Blockchain[infrastructure]
    if (blockchain) data[slug] = blockchain.slug
  })
  return data
}

const projectBlockchainOptions = { precacher: () => projectBlockchainPrecacher } as any
export const queryProjectBlockchain = (slug: string): Promise<string> =>
  query<any>(ALL_PROJECTS, projectBlockchainOptions).then((data) => data[slug])
