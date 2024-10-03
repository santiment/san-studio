import type { LayoutCreation } from './../api/layouts/mutate';
declare type Widget = {
    metrics?: Studio.Metric[];
};
export declare function getAllWidgetsMetrics(widgets: Widget[]): Studio.Metric[];
export declare const getAllWidgetsMetricsKeys: (widgets: Widget[]) => string[];
export declare function getLayoutMetrics(widgets: Widget[]): {};
export declare function getSavedRecentLayoutIds(): number[];
export declare function addRecentLayoutId(id: number | string): number[];
export declare function removeRecentLayoutId(id: number | string): number[];
export declare const saveScheduledLayout: (layout: Omit<SAN.Layout, 'id' | 'project' | 'user'>) => Omit<SAN.Layout, 'id' | 'project' | 'user'>;
export declare const getScheduledLayout: () => LayoutCreation;
export declare const deleteScheduledLayout: () => void;
export {};
