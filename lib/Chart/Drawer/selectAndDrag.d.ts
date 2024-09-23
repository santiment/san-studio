type Controller = {
    selectDrawing: (drawing?: SAN.Charts.Drawing) => void;
    startDrawing: () => void;
    stopDrawing: () => void;
    onDrawingDragEnd: (drawing: SAN.Charts.Drawing, oldAbsCoor: SAN.Charts.Drawing['absCoor'], data: any[]) => void;
};
export declare function newDoubleClickHandler(chart: SAN.Charts.Chart, onDrawingModified: Controller['onDrawingDragEnd']): () => void;
export declare function newDrawingSelectHandler(chart: SAN.Charts.Chart, controller: Controller): (e: MouseEvent) => void;
export declare const newDrawingDeleteHandler: (drawer: SAN.Charts.Drawer) => ({ key }: KeyboardEvent) => void;
export {};
