declare type Interval = {
    id: string;
    label: string;
};
export declare const INTERVALS: Interval[];
export declare function getIntervals(minInterval: string): Interval[];
export declare const isAvailableInterval: (interval: string | undefined, intervals: Interval[]) => boolean;
export declare const getValidInterval: (interval: string | undefined, intervals: Interval[]) => string | undefined;
export declare function getIntervalMilliseconds(interval: string): number;
export declare function normalizeInterval(interval: string, minInterval: string): string;
export {};
