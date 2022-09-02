import { query } from 'san-webkit/lib/api';
// import { capitalize } from 'san-webkit/lib/utils/formatting'
const NFT_COLLECTION_QUERY = (address, infrastructure) => `{
	getNftCollectionByContract(selector:{address:"${address}",infrastructure:"${infrastructure}"}) {
    name: nftCollection
	}
}`;
const nftCollectionAccessor = ({ getNftCollectionByContract }) => getNftCollectionByContract;
export const queryNftCollection = (address, infrastructure) => query(NFT_COLLECTION_QUERY(address, infrastructure)).then(nftCollectionAccessor);
export const checkIsNftAddress = (labels) => labels.some(({ name }) => name === 'erc721' || name === 'erc1155');
// -------------------------------------
const ADDRESS_LABELS_QUERY = (address, infrastructure) => `{
	blockchainAddress(selector:{address:"${address}",infrastructure:"${infrastructure}"}) {
    labels { name }
	}
}`;
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
const labelsAccessor = ({ blockchainAddress }) => blockchainAddress.labels;
export const queryAddressLabels = (address, infrastructure) => query(ADDRESS_LABELS_QUERY(address, infrastructure)).then(labelsAccessor);
//# sourceMappingURL=address.js.map