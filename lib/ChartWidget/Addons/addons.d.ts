/// <reference types="svelte" />
import './../../metrics/selector/subitems';
export declare const ADDONS: {
    readonly [x: number]: () => Promise<typeof import("*.svelte")>;
    readonly btc_halving: () => Promise<typeof import("*.svelte")>;
};
