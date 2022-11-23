export declare const resetDrawingRatioCoordinates: ({ ratioCoor, relCoor }: {
    ratioCoor: any;
    relCoor: any;
}) => any;
export declare const resetRatioCoordinates: (drawer: SAN.Charts.Drawer) => void;
export declare const resetDrawingRelativeCoordinates: ({ ratioCoor, relCoor }: {
    ratioCoor: any;
    relCoor: any;
}) => any;
export declare const resetRelativeCoordinates: (drawer: SAN.Charts.Drawer) => void;
export declare const resetDrawingAbsoluteCoordinates: ({ absCoor, relCoor, ratioCoor, }: SAN.Charts.Drawing) => 0;
export declare const resetAbsoluteCoordinates: (drawer: SAN.Charts.Drawer) => void;
export declare function correctAbsoluteCoordinatesRatio({ drawings }: SAN.Charts.Drawer, width: number, height: number): void;
export declare function setupDrawingsCoordinatesUpdater(chart: SAN.Charts.Chart, minMax: SAN.Charts.MinMax): void;
export declare function absoluteToRatioCoordinates(absCoor: number[], ratioCoor: number[], width: number, height: number): void;
export declare function ratioToAbsoluteCoordinates(ratioCoor: number[], absCoor: number[], width: number, height: number): void;
export declare function newAbsoluteToRelativeCoordinatesUpdater(chart: SAN.Charts.Chart, { min, max }: SAN.Charts.MinMax): (absCoor: number[], relCoor: number[]) => void;
export declare function newRelativeToAbsoluteCoordinatesUpdater(chart: SAN.Charts.Chart, { min, max }: SAN.Charts.MinMax): (relCoor: number[], absCoor: number[]) => void;
