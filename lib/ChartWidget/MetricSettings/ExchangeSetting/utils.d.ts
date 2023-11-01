export declare const ExchangeMetricsDefaults: {
    label: string;
    owners: string[];
    onDefault: (MetricSettings: any, key: string) => void;
};
export declare const OpenInterestMetricsDefaults: {
    label: string;
    owners: string[];
    onDefault: (MetricSettings: any, key: string) => void;
};
export declare function queryProjectExchanges(slug: string, isDex?: boolean): Promise<string[]>;
export declare function isExchangeModifiable(metric: Studio.Metric): boolean;
