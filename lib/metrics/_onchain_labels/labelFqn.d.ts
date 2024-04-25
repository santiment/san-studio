import { MetricCategory } from '../graph';
export declare const LABEL_ASSET_SLUG = "LABEL_ASSET_SLUG";
export declare function humanifyLabelMetricName(displayName: string): string;
export declare const getAssetFreeLabelKey: (slug: string, labelFqn: string) => string;
export declare const getDynamicAssetLabelKey: (slug: string, labelFqn: string) => string;
export declare function createDynamicLabelFqnMetric(slug: string, labelFqn: string, displayName?: string): import("../utils").Node<Studio.Metric, string> | {
    key: string;
    queryKey: string;
    label: string;
    node: "line";
    category: MetricCategory;
    reqMeta: {
        label_fqn: (vars?: any) => string;
    };
};
