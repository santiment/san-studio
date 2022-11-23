declare type NewDrawing = Partial<SAN.Charts.Drawing> & Pick<SAN.Charts.Drawing, 'type'>;
export declare function newDrawing<T extends NewDrawing>(drawing: T): T;
export declare function getEventCoordinates(e: MouseEvent): [number, number];
export declare function newRectHandle(x: number, y: number, width: number, height: number): Path2D;
export declare function newRoundHandle(x: number, y: number): Path2D;
export declare function checkIsOnStrokeArea(ctx: CanvasRenderingContext2D, shape: Path2D, x: number, y: number): boolean;
export declare function hook(node: HTMLElement, event: string, callback: (e: any) => any): () => void;
export {};
