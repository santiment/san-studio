export declare const HandleType: {
  readonly LEFT: 1
  readonly RIGHT: 2
  readonly MOVE: 3
}
export declare const LineLockType: {
  readonly FREE: 0
  readonly X: 1
  readonly Y: 2
}
export declare function newLine(x: number, y: number): SAN.Charts.Line
export declare function paintLine(chart: SAN.Charts.Chart, drawing: SAN.Charts.Line): void
export declare function updateLine(_: any, drawing: SAN.Charts.Line): void
export declare function checkLineIsHovered(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Line,
  mouseXY: [number, number],
  dpr: number,
): boolean
export declare function paintLineHover(
  { drawer, theme }: SAN.Charts.Chart,
  drawing: SAN.Charts.Line,
): void
declare type LineDragData = [number, number, boolean]
export declare function getLineDragData(
  ctx: CanvasRenderingContext2D,
  drawing: SAN.Charts.Line,
  x: number,
  y: number,
): LineDragData
export declare const getLineLockType: (x1: number, y1: number, x2: number, y2: number) => 1 | 2
export declare function lineDragModifier(
  drawing: SAN.Charts.Line,
  initialAbsCoor: SAN.Charts.Line['absCoor'],
  [isLeftHandleDrag, isRightHandleDrag, isNotLineDrag]: LineDragData,
  xDiff: number,
  yDiff: number,
  e: MouseEvent,
): void
export {}
