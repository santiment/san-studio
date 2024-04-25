import { SelectorNode } from '@/metrics/selector'
import '@/metrics/selector/subitems'

export const ADDONS = {
  [SelectorNode.SPENT_COIN_COST.key]: () => import('./SpentCoinCost.svelte'),
  btc_halving: () => import('./BitcoinHalving/Addon.svelte'),
} as const
