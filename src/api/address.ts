import { query } from 'webkit/api'
// import { capitalize } from 'webkit/utils/formatting'

const NFT_COLLECTION_QUERY = (address: string, infrastructure: string) => `{
	getNftCollectionByContract(selector:{address:"${address}",infrastructure:"${infrastructure}"}) {
    name: nftCollection
	}
}`

const nftCollectionAccessor = ({ getNftCollectionByContract }) => getNftCollectionByContract
export const queryNftCollection = (address: string, infrastructure: string) =>
  query<any>(NFT_COLLECTION_QUERY(address, infrastructure)).then(nftCollectionAccessor) as Promise<{
    name: string
  }>
export const checkIsNftAddress = (labels: { name: string }[]): boolean =>
  labels.some(({ name }) => name === 'erc721' || name === 'erc1155')

// -------------------------------------

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

const labelsAccessor = ({ blockchainAddress }: Query) => blockchainAddress.labels
export const queryAddressLabels = (address: string, infrastructure: string) =>
  query<Query>(ADDRESS_LABELS_QUERY(address, infrastructure)).then(labelsAccessor)
