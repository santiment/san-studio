import { saveJson, getSavedJson } from 'webkit/utils/localStorage'
import { getAddressInfrastructure } from 'webkit/utils/address'

export function newAddressSuggestion(address: string) {
  return {
    address,
    key: address,
    infrastructure: getAddressInfrastructure(address),
  }
}

const RECENT_KEY = '[recent]'
const RECENT_MASTER_SELECTIONS = 'RECENT_MASTER_SELECTIONS'

export const getRecents = () => getSavedJson(RECENT_MASTER_SELECTIONS, []) as any[]

export function addRecent({ priceUsd: _, ...item }) {
  const { key, rawKey = key } = item

  const recents = getRecents()
    .filter((recent) => recent.rawKey !== rawKey)
    .slice(0, 4)

  saveJson(RECENT_MASTER_SELECTIONS, [{ ...item, rawKey, key: RECENT_KEY + rawKey }, ...recents])
}

export function getRecentAssetMap(recents: any[]) {
  const map = {}
  recents.forEach((recent) => {
    if (recent.slug) map[recent.slug] = recent
  })
  return map
}
