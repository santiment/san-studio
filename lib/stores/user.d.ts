/// <reference types="svelte" />
import type { CurrentUser } from 'san-webkit/lib/api/analytics';
export declare const currentUser: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<CurrentUser>, invalidate?: import("svelte/store").Invalidator<CurrentUser> | undefined) => import("svelte/store").Unsubscriber;
};
