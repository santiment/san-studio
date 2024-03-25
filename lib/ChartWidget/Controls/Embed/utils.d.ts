import type { Metric } from './../../../sharing';
export declare function shareEmbeded(widget: any, studio: any, options: any): string;
export declare function parseQueryString(qs: string): {
    slug: any;
    ticker: any;
    address: any;
    isUTC: boolean;
    from: any;
    to: any;
    sharedAccessToken: any;
    isNightMode: boolean;
    isCartesianGrid: boolean;
    isWithMetricSettings: boolean;
    isWatermarkHidden: boolean;
    isSharedAxisEnabled: boolean;
    isMinimapEmbedded: boolean;
    isCalendarEnabled: boolean;
    isAdaptiveLayoutMinimized: boolean | undefined;
    metrics: Metric[];
    metricIndicators: {
        [metricKey: string]: Set<string>;
    };
    mergedMetrics: any[];
    metricSettings: {};
    colors: {};
    drawings: any[];
};
export declare function getChartWidgetLabel(widget: any, studio: any): string;
