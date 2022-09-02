declare type RestrictionMetric = {
  name: string
}
declare type RestrictionMetricMinInterval = RestrictionMetric & {
  minInterval: string
}
declare type MetricMinInterval = {
  [metricKey: string]: RestrictionMetricMinInterval | undefined
}
export declare const queryMinInterval: () => Promise<MetricMinInterval>
export declare const getMetricKeyMinInterval: (metricKey: string) => Promise<string | undefined>
export declare const getMetricMinInterval: ({
  key,
  queryKey,
}: Studio.Metric) => Promise<string | undefined>
export declare const queryRestrictedDates: () => Promise<MetricMinInterval>
export {}
