declare type InsightContext = {
  insight: string | undefined
  from: string | undefined
  to: string | undefined
}
export declare function newInsightsContextStore(): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<InsightContext>,
    invalidate?: ((value?: InsightContext | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set(newInsight: any, from: string, to: string): void
  apply(value: any): void
  changePeriod(from: string, to: string): void
}
export {}
