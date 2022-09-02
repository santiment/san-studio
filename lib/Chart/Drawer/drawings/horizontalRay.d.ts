export declare function newHorizontalRay(y: number): SAN.Charts.HorizontalRay;
export declare function paintHorizontalRay(chart: SAN.Charts.Chart, drawing: SAN.Charts.HorizontalRay): void;
export declare function updateHorizontalRay({ left, right }: SAN.Charts.Chart, drawing: SAN.Charts.HorizontalRay): void;
export declare function checkHorizontalRayIsHovered(ctx: CanvasRenderingContext2D, drawing: SAN.Charts.HorizontalRay, mouseXY: [number, number], dpr: number): boolean;
export declare function paintHorizontalRayHover({ drawer, theme }: SAN.Charts.Chart, drawing: SAN.Charts.HorizontalRay): void;
export declare function horizontalRayDragModifier(drawing: SAN.Charts.HorizontalRay, [_, y]: SAN.Charts.HorizontalRay['absCoor'], __: any, ___: any, yDiff: number): void;
export declare function newHorizontalRayCreationHandler(chart: SAN.Charts.Chart, onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void, onNewDrawingEnd: (drawing: SAN.Charts.Drawing, type?: string) => void): (e: MouseEvent) => void;
