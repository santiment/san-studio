/// <reference types="svelte" />
import { linearScale } from '@santiment-network/chart/scales';
declare const OPTIONS: {
    scale: typeof linearScale;
    isLogScale: boolean;
    cartesianGrid: boolean;
    watermark: boolean;
    isWatermarkLessVisible: boolean;
};
declare type ChartOptions = typeof OPTIONS;
export declare function newChartOptionsStore({ isCartesianGrid, isWatermarkHidden }?: any): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        scale: typeof linearScale;
        isLogScale: boolean;
        cartesianGrid: boolean;
        watermark: boolean;
        isWatermarkLessVisible: boolean;
    }>, invalidate?: import("svelte/store").Invalidator<{
        scale: typeof linearScale;
        isLogScale: boolean;
        cartesianGrid: boolean;
        watermark: boolean;
        isWatermarkLessVisible: boolean;
    }> | undefined) => import("svelte/store").Unsubscriber;
    set: (this: void, value: {
        scale: typeof linearScale;
        isLogScale: boolean;
        cartesianGrid: boolean;
        watermark: boolean;
        isWatermarkLessVisible: boolean;
    }) => void;
    toggleScale(): void;
    toggle(option: string): void;
    getProDefaults(isPro: any, isProPlus: any): void;
};
declare global {
    const $chartOptions: ChartOptions;
}
export {};
