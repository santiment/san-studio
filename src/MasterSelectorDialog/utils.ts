import { saveJson, getSavedJson } from 'webkit/utils/localStorage'
import { getAddressInfrastructure } from 'webkit/utils/address'
import { Metric } from '@/metrics'
import { ContractAddressMetric } from '@/metrics/_onchain/contractAddress'

export function newAddressSuggestion(address: string): {
  address: string
  key: string
  infrastructure?: string
} {
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

const hashMetrics = (metrics) =>
  metrics
    .map(({ key }) => key)
    .sort()
    .toString()

const DEFAULT_PROJECT_METRICS = [Metric.price_usd]
const DEFAULT_ADDRESS_METRICS = [
  Metric.contract_transactions_count,
  Metric.contract_interacting_addresses_count,
]

const PROJECT_HASH = hashMetrics(DEFAULT_PROJECT_METRICS)
const ADDRESS_HASH = hashMetrics(DEFAULT_ADDRESS_METRICS)
export function replaceDefaultMetrics(item, widgets) {
  if (widgets.length > 1) return

  const widget = widgets[0]
  const { metrics, Metrics } = widget

  if (metrics.length > 2) {
    return
  }

  const hash = hashMetrics(metrics)
  if (hash !== PROJECT_HASH && hash !== ADDRESS_HASH) return

  Metrics.set(item.address ? DEFAULT_ADDRESS_METRICS : DEFAULT_PROJECT_METRICS)

  if (item.address) {
    window.onDefaultLayoutAddressSelect?.()
  }
}
