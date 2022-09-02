export declare enum MapviewPhase {
  None = 0,
  Overview = 1,
  Metrics = 2,
}
export declare const mapview: {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<MapviewPhase>,
    invalidate?: ((value?: MapviewPhase | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  overview(): void
  exit(): void
  toggle(): void
  checkActiveMetrics(hasActiveMetrics: boolean): void
}
declare global {
  const $mapview: MapviewPhase
}
