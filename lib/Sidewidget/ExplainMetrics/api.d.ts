export declare const queryMetricInfo: (metric: string, slug: string) => Promise<{
    availableSince: string;
    lastDatetimeComputedAt: string;
}>;
