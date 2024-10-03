/// <reference types="./api" />
export declare const GET_METRIC = "\n  query getMetric(\n    $metric: String!\n    $from: DateTime!\n    $to: DateTime!\n    $slug: String\n    $watchlistSlug: String\n    $text: String\n    $slugs: [String]\n    $interval: interval\n    $transform: TimeseriesMetricTransformInputObject\n    $holdersCount: Int\n    $market_segments: [String]\n    $ignored_slugs: [String]\n    $source: String\n    $owner: String\n    $label: String\n    $labels: [String]\n    $aggregation: Aggregation\n    $label_fqn: String\n    $address: String\n    $nftAddress: String\n    $includeIncompleteData: Boolean = true\n    $ecosystems: [String]\n  ) {\n    getMetric(metric: $metric) {\n      timeseriesData(\n        selector: {\n          slug: $slug\n          address: $nftAddress\n          contractAddress: $address\n          watchlistSlug: $watchlistSlug\n          text: $text\n          slugs: $slugs\n          labels: $labels\n          holdersCount: $holdersCount\n          market_segments: $market_segments\n          ignored_slugs: $ignored_slugs\n          source: $source\n          owner: $owner\n          label: $label\n          labelFqn: $label_fqn\n          ecosystems: $ecosystems\n        }\n        from: $from\n        to: $to\n        interval: $interval\n        transform: $transform\n        aggregation: $aggregation\n        includeIncompleteData: $includeIncompleteData\n      ) {\n        d: datetime\n        v: value\n      }\n    }\n  }\n";
export declare type RawTimeseries = SAN.API.Query<'getMetric', {
    timeseriesData: {
        d: string;
        v: number;
    }[];
}>;
export declare type MetricTimeseries = {
    datetime: number;
    [key: string]: number;
}[];
export declare type Timeseries = SAN.API.Query<'getMetric', {
    timeseriesData: MetricTimeseries;
}>;
export declare type Variables = {
    key: string;
    metric?: string;
    from: string;
    to: string;
    slug: string;
    interval?: string;
};
export declare function queryMetric(variables: Variables, precacher?: (variables: Variables) => any, cachePolicy?: SAN.API.CachePolicy, requestOptions?: SAN.API.RequestOptions): Promise<any>;
export declare function getSharedAccessHeaders(sharedAccessToken: any): {
    'X-SharedAccess-Authorization': string;
    'Content-Type': string;
    authorization: null;
    origin: any;
} | undefined;
