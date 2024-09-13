import { SelectorNode } from '@/metrics/selector'
import '@/metrics/selector/subitems'

export const ADDONS = {
  [SelectorNode.SPENT_COIN_COST.key]: () => import('./SpentCoinCost.svelte'),
  btc_halving: () => import('./BitcoinHalving/Addon.svelte'),
  cancun_upgrade: () => import('./CancunUpgrade/Addon.svelte'),
} as const
