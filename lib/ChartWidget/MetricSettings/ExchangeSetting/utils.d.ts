export declare const DEFAULT_EXCHANGE = "Auto (Default)";
export declare const DEFAULT_EXCHANGES: string[];
export declare function queryProjectExchanges(slug: string, isDex?: boolean): Promise<string[]>;
export declare function isExchangeModifiable(metric: Studio.Metric): boolean;
