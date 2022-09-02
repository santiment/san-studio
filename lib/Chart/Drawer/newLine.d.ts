export declare function newLineCreationHandler(
  chart: SAN.Charts.Chart,
  onNewDrawingStart: (drawing: SAN.Charts.Drawing) => void,
  onNewDrawingEnd: (drawing: SAN.Charts.Drawing) => void,
): (e: MouseEvent) => void
