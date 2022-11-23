import { Metric } from './../../../lib/metrics';
export declare function calculateMovingAverageFromInterval(interval: any): number;
export declare function transformMetricSettings(metric: Studio.Metric, metricSettings: Studio.MetricSetting, metrics: Studio.Metric[], studioSettings: any, ChartMetricDisplays?: any): Studio.MetricSetting;
export declare function newMetricSettingsTransformer(settings: any, ChartMetricDisplays: any): (metric: Studio.Metric, metricSettings: Studio.MetricSetting, metrics: Studio.Metric[]) => import("../MetricSettings/context").MetricSetting;
