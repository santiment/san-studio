export declare const indexSorter: (a: string, b: string) => number;
export declare const FIAT_FUND_ASSETS: {
    slug: string;
    name: string;
    ticker: string;
}[];
export declare const queryProjectMetrics: (slug: string) => Promise<{
    metrics: string[];
    docs: Record<string, null | string>;
}>;
export declare const queryAddressMetrics: (_address: string) => Promise<string[]>;
