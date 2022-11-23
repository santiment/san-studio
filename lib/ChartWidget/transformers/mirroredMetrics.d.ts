export declare const MirroredMetric: {
    [x: string]: import("../../metrics/utils").Node<Studio.Metric, string>;
};
export declare function transformMirroredMetric(metric: Studio.Metric, metricSettings: Studio.MetricSetting, metrics: Studio.Metric[]): Studio.MetricSetting;
