export declare type ProjectPriceChange = {
    priceUsd: number;
    percentChange24h: number;
    marketcapUsd: number;
    rank: number;
};
export declare const queryProjectPriceChange: (slug: string) => Promise<ProjectPriceChange>;
export declare const queryProject: (slug: string) => Promise<string>;
export declare const queryAllProjects: () => Promise<any[]>;
