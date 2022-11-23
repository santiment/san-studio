export declare const MetricColor: {
    price_usd: string;
    volume_usd: string;
    social_volume_total: string;
    dev_activity: string;
    mvrv_usd: string;
    daily_active_addresses: string;
};
export declare const COLORS: string[];
export declare const ALL_COLORS: Set<string>;
export declare function newChartColors(metrics: any[], prevColors?: {}): {
    [key: string]: string;
};
export declare function newHighlightedColors(colors: any, { key }: {
    key: any;
}): any;
