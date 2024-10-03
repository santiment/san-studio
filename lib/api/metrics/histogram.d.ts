declare type Histogram = {
    buckets: {
        range: [number, number];
        amount: number;
    }[];
    price: number;
};
export declare const queryPriceHistogram: (slug: string, from: string, to: string) => Promise<Histogram[]>;
export {};
