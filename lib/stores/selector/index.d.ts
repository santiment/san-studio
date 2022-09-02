import type { Store } from './utils'
export declare const selectedItems: {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<Store>,
    invalidate?: ((value?: Store | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set(metrics: Studio.Metric[]): void
  clear(): void
  toggle(item: any): void
}
