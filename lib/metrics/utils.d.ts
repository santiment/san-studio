export declare enum MetricType {
  Basic = 0,
  ProjectLocked = 1,
  Indicator = 2,
  MergedSupplyDistribution = 3,
  AddressLocked = 4,
}
export declare type Node<T, K> = T & {
  key: K
}
declare type Nodes = {
  [key: string]: {
    [key: string]: any
  }
}
declare type NodesMap<T extends Nodes, U = Studio.Metric> = {
  [K in keyof T]: Node<U, K>
}
export declare const newKey: (...data: any[]) => string
export declare function each<T extends Nodes, U>(
  nodes: T,
  clb: (node: U, key: string, i: number) => void | any,
): NodesMap<T, U>
export declare function deriveMetric(
  baseMetric: Studio.Metric,
  newMetric: Studio.Metric,
): Studio.Metric
declare type Project = {
  slug: string
  ticker: string
}
export declare function newProjectMetricKey(project: Project, metric: Studio.Metric): string
export declare function newProjectMetric(project: Project, baseMetric: Studio.Metric): any
export declare function minifyAddress(address: string): string
export declare function newAddressMetric(address: string, baseMetric: Studio.Metric): any
export {}
