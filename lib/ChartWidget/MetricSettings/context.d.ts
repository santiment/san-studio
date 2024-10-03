/// <reference types="svelte" />
export declare type MetricSetting = {
    node?: string;
    interval?: string;
    transform?: {
        type: string;
        movingAverageBase: number;
    };
    fetcher?: any;
    queryKey?: string;
    owner?: string;
    preTransform?: (...args: any[]) => any;
    getPreTransformValue?: (...args: any[]) => any;
    __appliedInterval?: boolean;
};
export declare type MetricSettings = {
    [metricKey: string]: MetricSetting | undefined;
};
export declare function newMetricSettingsStore(defaultValue?: MetricSettings): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<MetricSettings>, invalidate?: import("svelte/store").Invalidator<MetricSettings> | undefined) => import("svelte/store").Unsubscriber;
    getValue(): MetricSettings;
    getMetricSettings(metricKey: string): MetricSetting;
    replace(oldMetricKey: string, newMetricKey: string): void;
    set(metricKey: string, setting: MetricSetting): void;
    delete(metricKey: string, settingKey: string): void;
    update(metrics: Studio.Metric[], transformer?: (_: Studio.Metric, __: MetricSetting, ___: Studio.Metric[]) => MetricSetting): void;
};
declare global {
    const $MetricSettings: {};
}
