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

function precacher({ getAvailableBlockchains }: Query) {
  getAvailableBlockchains.forEach((data) => {
    data.slug = data.blockchain
    data.blockchain = data.blockchain.split('-').map(capitalize).join(' ')
  })
  return getAvailableBlockchains
}
const options = { precacher: () => precacher } as any
export const queryAvailableBlockchains = (): Promise<Blockchain[]> =>
  query<Query>(AVAILABLE_BLOCKCHAINS_QUERY, options) as any as Promise<Blockchain[]>
