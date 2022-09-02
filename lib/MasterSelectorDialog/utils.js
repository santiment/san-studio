var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]]
      }
    return t
  }
import { saveJson, getSavedJson } from 'san-webkit/lib/utils/localStorage'
import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
import { Metric } from './../../lib/metrics'
export function newAddressSuggestion(address) {
  return {
    address,
    key: address,
    infrastructure: getAddressInfrastructure(address),
  }
}
const RECENT_KEY = '[recent]'
const RECENT_MASTER_SELECTIONS = 'RECENT_MASTER_SELECTIONS'
export const getRecents = () => getSavedJson(RECENT_MASTER_SELECTIONS, [])
export function addRecent(_a) {
  var { priceUsd: _ } = _a,
    item = __rest(_a, ['priceUsd'])
  const { key, rawKey = key } = item
  const recents = getRecents()
    .filter((recent) => recent.rawKey !== rawKey)
    .slice(0, 4)
  saveJson(RECENT_MASTER_SELECTIONS, [
    Object.assign(Object.assign({}, item), { rawKey, key: RECENT_KEY + rawKey }),
    ...recents,
  ])
}
export function getRecentAssetMap(recents) {
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
  var _a
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
    ;(_a = window.onDefaultLayoutAddressSelect) === null || _a === void 0 ? void 0 : _a.call(window)
  }
}
//# sourceMappingURL=utils.js.map
