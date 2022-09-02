import type { Selector } from './index'
export declare const ReplacementNode: {
  [x: string]:
    | Studio.Metric[]
    | ({
        selectorType: import('./types').SelectorType
      } & Studio.Metric & {
          key: string
        })
    | import('../utils').Node<Studio.SelectorNode, 'addresses_number_distribution'>
    | import('../utils').Node<Studio.SelectorNode, 'addresses_balance_distribution'>
    | import('../utils').Node<Studio.SelectorNode, 'labeled_addresses_number_distribution'>
}
export declare function lookupReplacement(SelectorNode: Selector, key: string): boolean
