/// <reference types="svelte" />
import type { Store } from './utils';
export declare const selectedItems: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Store>, invalidate?: import("svelte/store").Invalidator<Store> | undefined) => import("svelte/store").Unsubscriber;
    set(metrics: Studio.Metric[]): void;
    clear(): void;
    toggle(item: any): void;
};
