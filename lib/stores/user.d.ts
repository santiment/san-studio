import type { CurrentUser } from 'san-webkit/lib/api/analytics'
export declare const currentUser: {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<CurrentUser>,
    invalidate?: ((value?: CurrentUser | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
}
