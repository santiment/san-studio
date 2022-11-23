export declare function checkIsHovered(chart: SAN.Charts.Chart, mouseXY: [number, number], e: MouseEvent): SAN.Charts.Drawing | undefined;
declare type HoverPainter = (chart: SAN.Charts.Chart, drawing: SAN.Charts.Drawing) => void;
export declare const getDrawingHoverPainter: ({ type }: SAN.Charts.Drawing) => HoverPainter | undefined;
export declare function newMouseHoverHandler(chart: SAN.Charts.Chart, setHovered: (drawing?: SAN.Charts.Drawing) => void): (e: MouseEvent) => void;
export {};
