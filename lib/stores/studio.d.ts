/// <reference types="svelte" />
export declare type StudioSettings = {
    slug: string;
    from: string;
    to: string;
    interval: string;
    ticker: string;
    address?: string;
    logoUrl?: string;
};
export declare const STUDIO: StudioSettings;
export declare function getPeriodInterval(from: Date, to: Date): string;
export declare const studio: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<StudioSettings>, invalidate?: import("svelte/store").Invalidator<StudioSettings> | undefined) => import("svelte/store").Unsubscriber;
    get: () => StudioSettings;
    setProject(project: any): void;
    setPeriod(from: Date, to: Date): void;
};
export declare const LOCKED_ASSET_CONTEXT = "LOCKED_ASSET_CONTEXT";
export declare const setLockedAssetStore: (store: any) => void;
export declare const getLockedAssetStore: () => any;
export declare function newLockedAssetStore(): void;
declare global {
    const $studio: StudioSettings;
}
