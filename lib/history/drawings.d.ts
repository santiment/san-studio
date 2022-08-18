import type { History, Scrollable } from 'san-webkit/lib/ui/history'
declare type Widget = Scrollable & {
  chart: SAN.Charts.Chart
  ChartDrawer: any
}
export declare function recordNewDrawing(
  History: History,
  ChartDrawer: any,
  widget: Widget,
  drawing: SAN.Charts.Drawing,
): void
export declare function recordDeleteDrawing(
  History: History,
  ChartDrawer: any,
  widget: Widget,
  drawing: SAN.Charts.Drawing,
): void
export declare function recordDrawingModified(
  History: History,
  widget: Widget,
  drawing: SAN.Charts.Drawing,
  oldRatioCoor: SAN.Charts.Drawing['absCoor'],
  data: any[],
): void
export declare function recordDrawingVisibility(
  History: History,
  widget: Widget,
  isHidden: boolean,
): void
export {}
