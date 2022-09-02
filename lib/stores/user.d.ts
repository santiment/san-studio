import type { CurrentUser } from 'san-webkit/lib/api/analytics'
declare const subscribe: (
  this: void,
  run: import('svelte/store').Subscriber<CurrentUser>,
  invalidate?: ((value?: CurrentUser | undefined) => void) | undefined,
) => import('svelte/store').Unsubscriber
export declare const currentUser: {
  subscribe: typeof subscribe
}
export {}
