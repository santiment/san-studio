export declare function shareWidget(widget: any): {
    wm: string[];
    whm: string[];
    wax: string[];
    wpax: string[];
    wc: string[];
    ws: {} | undefined;
    wcm: any;
    wd: any;
    wsm: any;
    whl: any;
    wcadon: any;
    wcsb: any;
    wcsa: number | undefined;
};
export declare function parseMetricSettings(settings: any, metrics: any): {};
declare type ParseCtx = {
    parseSubwidgets: (any: any) => any;
};
export declare function parseWidget(shared: any, ctx?: ParseCtx): {
    metrics: import("./index").Metric[];
    hiddenMetrics: import("./index").Metric[];
    metricIndicators: {
        [metricKey: string]: Set<string>;
    };
    mergedMetrics: any[];
    metricSettings: {};
    colors: {};
    drawings: any[];
    pinnedAxes: Set<any> | undefined;
    signalMetrics: any;
    holderLabels: any;
    isSharedAxisEnabled: boolean;
    chartAddons: any;
};
export {};
