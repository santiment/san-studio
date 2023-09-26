/// <reference types="svelte" />
export declare const CONTEXT = "QUEUE";
export declare const getQueueStore: () => ReturnType<typeof newSizedQueue>;
export declare function newSizedQueue(size?: number): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Set<unknown>>, invalidate?: import("svelte/store").Invalidator<Set<unknown>> | undefined) => import("svelte/store").Unsubscriber;
    add(widget: any): void;
    delete(widget: any): void;
};