export declare function newAddressSuggestion(address: string): {
    address: string;
    key: string;
    infrastructure?: string;
};
export declare const getRecents: () => any[];
export declare function addRecent({ priceUsd, ...item }: {
    [x: string]: any;
    priceUsd: any;
}): void;
export declare function getRecentAssetMap(recents: any[]): {};
export declare function replaceDefaultMetrics(item: any, widgets: any): void;
