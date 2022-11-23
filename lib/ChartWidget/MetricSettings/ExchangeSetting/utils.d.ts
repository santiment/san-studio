export declare const DEFAULT_EXCHANGE = "All (CEX+DEX)";
export declare const DEFAULT_EXCHANGES: string[];
export declare function queryProjectExchanges(slug: string, isDex?: boolean): Promise<string[]>;
export declare function isExchangeModifiable(metric: Studio.Metric): boolean;
