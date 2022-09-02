export declare type Indicators = Set<{
  key: string
}>
export declare type Signals = Studio.Metric[]
export declare function newMetricSignalsStore(defaultValue?: Signals): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<Signals>,
    invalidate?: ((value?: Signals | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set(newMetrics: Studio.Metric[]): void
  add(metric: Studio.Metric): void
  delete(metric: Studio.Metric): void
  clear(): void
  concat(newMetrics: Studio.Metric[]): void
  deleteEach(metrics: Studio.Metric[]): void
  update(metrics: Studio.Metric[]): void
}
export declare function newSignalsTimeseriesStore(): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any[]>,
    invalidate?: ((value?: any[] | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  update(
    metrics: Studio.Metric[],
    {
      slug,
      ticker,
      from,
      to,
      interval,
    }: {
      slug: any
      ticker: any
      from: any
      to: any
      interval: any
    },
  ): void
}
