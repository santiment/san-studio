/// <reference types="svelte" />
export declare function createMinimizedEmbed(): {
    toggle(): void;
    set(this: void, value: {
        minimized: boolean;
        controls: boolean;
    }): void;
    update(this: void, updater: import("svelte/store").Updater<{
        minimized: boolean;
        controls: boolean;
    }>): void;
    subscribe(this: void, run: import("svelte/store").Subscriber<{
        minimized: boolean;
        controls: boolean;
    }>, invalidate?: import("svelte/store").Invalidator<{
        minimized: boolean;
        controls: boolean;
    }> | undefined): import("svelte/store").Unsubscriber;
};
export declare const minimized$: {
    toggle(): void;
    set(this: void, value: {
        minimized: boolean;
        controls: boolean;
    }): void;
    update(this: void, updater: import("svelte/store").Updater<{
        minimized: boolean;
        controls: boolean;
    }>): void;
    subscribe(this: void, run: import("svelte/store").Subscriber<{
        minimized: boolean;
        controls: boolean;
    }>, invalidate?: import("svelte/store").Invalidator<{
        minimized: boolean;
        controls: boolean;
    }> | undefined): import("svelte/store").Unsubscriber;
};
