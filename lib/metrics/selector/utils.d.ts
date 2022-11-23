import type { SelectorGraph } from './../../../lib/metrics/graph';
export declare function getMetricsSelectorGraph(metricKeys: string[], options: {
    [key: string]: string;
}): SelectorGraph;
export declare const checkIsFilterMatch: (searchTerm: string, { label, title, group, shorthand }: Studio.Metric & {
    title: string;
}) => boolean | "" | undefined;
export declare function filterSelectorGraph(graph: SelectorGraph, searchTerm: string): {};
