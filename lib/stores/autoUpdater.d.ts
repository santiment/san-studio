/// <reference types="svelte" />
export declare const CONTEXT = "AUTO_UPDATER";
export declare const setAutoUpdater: (store: any) => void;
export declare const getAutoUpdater: () => any;
export declare function newAutoUpdaterStore(Widgets: any): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        isUpdating: boolean;
        lastUpdate: number;
    }>, invalidate?: import("svelte/store").Invalidator<{
        isUpdating: boolean;
        lastUpdate: number;
    }> | undefined) => import("svelte/store").Unsubscriber;
    check({ to }: {
        to: any;
    }): void;
    enable(changePeriod: any): void;
    update(refetch?: boolean): void;
};
