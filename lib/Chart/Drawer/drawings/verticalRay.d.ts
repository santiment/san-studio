export declare function newVerticalRay(x: number): SAN.Charts.VerticalRay;
export declare function paintVerticalRay(chart: SAN.Charts.Chart, drawing: SAN.Charts.VerticalRay): void;
export declare function updateVerticalRay({ top, bottom }: SAN.Charts.Chart, drawing: SAN.Charts.VerticalRay): void;
export declare function checkVerticalRayIsHovered(ctx: CanvasRenderingContext2D, drawing: SAN.Charts.VerticalRay, mouseXY: [number, number], dpr: number): boolean;
export declare function paintVerticalRayHover({ drawer, theme }: SAN.Charts.Chart, drawing: SAN.Charts.VerticalRay): void;
export declare function verticalRayDragModifier(drawing: SAN.Charts.VerticalRay, [x]: SAN.Charts.VerticalRay['absCoor'], __: any, xDiff: number): void;
export declare function newVerticalRayCreationHandler(chart: SAN.Charts.Chart, onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void, onNewDrawingEnd: (drawing: SAN.Charts.Drawing, type?: string) => void): (e: MouseEvent) => void;
