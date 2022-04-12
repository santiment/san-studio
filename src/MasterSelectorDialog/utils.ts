import { saveJson, getSavedJson } from 'webkit/utils/localStorage'
import { getAddressInfrastructure } from 'webkit/utils/address'

export function newAddressSuggestion(address: string) {
  return {
    address,
    id: address,
    infrastructure: getAddressInfrastructure(address),
  }
}

const RECENT_MASTER_SELECTIONS = 'RECENT_MASTER_SELECTIONS'

export const getRecents = () => getSavedJson(RECENT_MASTER_SELECTIONS, []) as any[]

export function addRecent({ priceUsd: _, ...item }) {
  const recents = getRecents()
    .filter(({ slug }) => slug !== item.slug)
    .slice(0, 4)

  saveJson(RECENT_MASTER_SELECTIONS, [{ ...item, id: 'recent_' + item.slug }, ...recents])
}
