export declare type Metric = {
  key: string
  label: string
  expression?: string
  base?: any
}
export declare type CombinedMetric = Metric & {
  baseMetrics: Metric[]
}
declare type MetricAlias = {
  [metricKey: string]: string
}
export declare function newURLQuery(obj: {
  [key: string]: undefined | number | string | string[]
}): string
export declare const shareMetrics: (metrics: Metric[]) => string[]
export declare function newMetricAlias(metricKeys: string[]): MetricAlias
export declare function eachAlias<T>(
  keys: string[],
  metricAlias: MetricAlias,
  clb: (metricKey: string) => T,
): T[]
export declare const shareAxesMetrics: (
  axesMetrics: Metric[] | undefined,
  accessor?: ({ key }: Metric) => string,
) => string[]
export declare const shareColors: (
  colors: {
    [metricKey: string]: string
  },
  metricAlias: MetricAlias,
) => string[]
export declare function shareMetricSettings(
  settings: {
    [metricKey: string]: any
  },
  metricAlias: MetricAlias,
): (
  | undefined
  | {
      [alias: string]: any
    }
)[]
export declare function getKey(metricKey: string, metricAlias: MetricAlias): string
export declare function shareCombinedMetrics(metrics: Metric[]): {
  k: string
  exp: string | undefined
  l: any
  bm: string[]
}[]
export declare function getArrayValues(str: string): string[]
export {}
