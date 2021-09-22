import { SelectorNode } from '@/metrics/selector'
import '@/metrics/selector/subitems'

export const ADDONS = {
  [SelectorNode.SPENT_COIN_COST.key]: () => import('./SpentCoinCost.svelte'),
} as const
