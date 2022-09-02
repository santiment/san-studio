export declare function newDatetimeBubbleDrawer(
  chart: SAN.Charts.Chart,
  ctx: CanvasRenderingContext2D,
): (x: number, date: number) => void | 0
export declare function newValueBubbleDrawer(
  chart: SAN.Charts.Chart,
  ctx: CanvasRenderingContext2D,
): (metric: string, y: number, offset: number) => void
export declare function newDrawingAxesPainter(
  chart: SAN.Charts.Chart,
  drawing: SAN.Charts.Drawing,
): () => void
