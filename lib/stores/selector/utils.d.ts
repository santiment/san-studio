export declare const Selectable: {
    readonly Metrics: "metrics";
    readonly Notables: "notables";
    readonly Subwidgets: "subwidgets";
    readonly ChartAddons: "chartAddons";
};
declare const selectables: ("metrics" | "subwidgets" | "notables" | "chartAddons")[];
export declare type Selectables = typeof selectables[number];
export declare type SetOf = {
    [key in Selectables]: Set<any>;
} & {
    all: Set<any>;
};
export declare type Store = {
    [key in Selectables]: any[];
} & {
    has: (item: any) => boolean;
};
declare type SelectablesModifier = (item: any, store: Store, setOf: SetOf, hasItem: boolean) => void;
export declare const SelectableModifier: {
    metrics?: SelectablesModifier | undefined;
    subwidgets?: SelectablesModifier | undefined;
    notables?: SelectablesModifier | undefined;
    chartAddons?: SelectablesModifier | undefined;
};
export declare const each: (clb: (selectable: Selectables) => any) => void;
export declare function getSelectableType(item: any): Selectables;
export {};
