import { query } from 'webkit/api'
import { capitalize } from 'webkit/utils/formatting'

const ADDRESS_LABELS_QUERY = (address: string, infrastructure: string) => `{
	blockchainAddress(selector:{address:"${address}",infrastructure:"${infrastructure}"}) {
    labels { name }
	}
}`

type Query = SAN.API.Query<
  'blockchainAddress',
  {
    labels: { name: string }[]
  }
>

/* 
function precacher({ getAvailableBlockchains }: Query) {
  getAvailableBlockchains.forEach((data) => {
    data.slug = data.blockchain
    data.blockchain = data.blockchain.split('-').map(capitalize).join(' ')
  })
  return getAvailableBlockchains
}
const options = { precacher: () => precacher } as any
*/

const accessor = ({ blockchainAddress }: Query) => blockchainAddress.labels
export const queryAddressLabels = (address: string, infrastructure: string) =>
  query<Query>(ADDRESS_LABELS_QUERY(address, infrastructure)).then(accessor)
