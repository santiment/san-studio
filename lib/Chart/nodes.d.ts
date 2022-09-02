export declare const Node: {
    readonly CANDLES: "candle";
} & {
    readonly LINE: "line";
    readonly FILLED_LINE: "filledLine";
    readonly GRADIENT_LINE: "gradientLine";
    readonly AREA: "area";
} & {
    readonly BAR: "bar";
    readonly GREEN_RED_BAR: "greenRedBar";
};
export declare const LINES: Set<"line" | "filledLine" | "gradientLine" | "area">;
export declare const BARS: Set<"bar" | "greenRedBar">;
export declare type ChartNode = typeof Node;
export declare type ChartNodes = ChartNode[keyof ChartNode];
export declare const NodeAlias: {
    autoWidthBar: "bar";
};
export declare type MetricNodes = {
    joinedCategories: string[];
    candles: string[];
    lines: string[];
    bars: string[];
    areas: string[];
    filledLines: string[];
    gradientLines: string[];
    greenRedBars: string[];
};
export declare function getMetricNodes(metrics: Studio.Metric[], MetricSettings: Studio.MetricSettings): MetricNodes;
