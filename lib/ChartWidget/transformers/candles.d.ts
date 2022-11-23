export declare function getCandlesPeriodMinInterval(from: Date, to: Date): string;
export declare function cleanupCandlesSettings(metric: Studio.Metric, metricSettings: Studio.MetricSetting, ChartMetricDisplays: any): void;
export declare function setCandlesSettings(metric: Studio.Metric, metricSettings: Studio.MetricSetting, { from, to }: {
    from: any;
    to: any;
}, ChartMetricDisplays: any): void;
export declare function transformCandles(metric: Studio.Metric, metricSettings: Studio.MetricSetting, studioSettings: any, ChartMetricDisplays?: any): import("../MetricSettings/context").MetricSetting;
