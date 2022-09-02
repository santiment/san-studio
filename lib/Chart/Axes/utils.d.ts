export declare const Y_MARGIN = 25
export declare const X_MARGIN = 20
export declare const MULTI_AXIS_WIDTH = 50
export declare function getPadding(
  chart: Studio.Chart,
  axesMetricKeys: any[],
): {
  bottom: number
  right: number
  top: number
  left: number
}
export declare function getBubbleFontColorHex(
  color: string,
  isNightMode?: boolean,
): '#000000' | '#ffffff'
export declare function getBubbleTheme(theme: any, color: string): any
export declare function yAxisFormatter(value: number): string | number
export declare function getMetricAxisFormatter(metricSettings: any, key: any): any
export declare function getDomainObject(domainGroups: string[][]): {}
export declare function plotMetricLastValueBubble(
  chart: any,
  metricKey: any,
  metricSettings: any,
  LastMetricPoint: any,
  offset: any,
  color: any,
): void
export declare function getXTicksByWidth(width?: number): 6 | 3 | 10 | 5 | 8 | 12
export declare function getResponsiveAxesKeys(
  width: number | undefined,
  axesMetricKeys: string[],
): string[]
