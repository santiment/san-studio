export declare type ProjectPriceChange = {
    priceUsd: number;
    percentChange24h: number;
    marketcapUsd: number;
    rank: number;
};
export declare const queryProjectPriceChange: (slug: string) => Promise<ProjectPriceChange>;
export declare const queryProject: (slug: string) => Promise<string>;
export declare const APPEND_ALL_PROJECTS_QUERY: (scheme: string) => void;
export declare const queryAllProjects: () => Promise<any[]>;
