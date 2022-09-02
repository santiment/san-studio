export declare type MetricsStore = ReturnType<typeof newMetricsStore>
export declare function newMetricsStore(defaultMetrics?: Studio.Metric[]): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<Studio.Metric[]>,
    invalidate?: ((value?: Studio.Metric[] | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  getValue(): Studio.Metric[]
  set(newMetrics: Studio.Metric[]): void
  add(metric: Studio.Metric): void
  delete(metric: Studio.Metric): void
  toggle(metric: Studio.Metric): void
  replace(index: number, newMetric: Studio.Metric): void
  concat(newMetrics: Studio.Metric[]): void
  deleteEach(metrics: Studio.Metric[]): void
  hasConvertedMetric(metric: Studio.Metric, project: Studio.Project): boolean
}
export declare function newHiddenMetricsStore(defaultMetrics?: any): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<Set<unknown>>,
    invalidate?: ((value?: Set<unknown> | undefined) => void) | undefined,
  ) => import('svelte/store').Unsubscriber
  set: (this: void, value: Set<unknown>) => void
  hide(metric: any): void
  show(metric: any): void
  toggle(metric: any): void
  has(metric: any): boolean
}
