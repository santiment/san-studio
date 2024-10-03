import type { initChart } from '@santiment-network/chart';
declare type SanChart = ReturnType<typeof initChart>;
export declare type Chart = SanChart & {
    plotManager: ReturnType<typeof newPlotManager>;
    tooltip?: any;
    drawTooltip?: (point: any, y: number) => any;
    isDrawing: boolean;
    isSelecting: boolean;
    drawSelection?: (x: number, y: number, point: any) => any;
    scale: any;
    axesMetricKeys?: string[];
    domainGroups?: string[][];
    colors: {
        [metricKey: string]: string;
    };
    theme: any;
    clear?: () => void;
};
export declare const CONTEXT = "chartManager";
export declare const setChart: (chart: Chart) => Chart;
export declare const getChart: () => Chart;
export declare type Plotter = (chart: any, scale: any, data: any, colors: any, categories: any) => any;
export declare function newPlotManager(): {
    items: Map<string, Plotter>;
    delete(id: string): void;
    get(id: string): null | Plotter;
    set(id: string, clb: Plotter): void;
    subscribe(subscriber: any): () => boolean;
    emitDrawFinish(): void;
};
export {};
