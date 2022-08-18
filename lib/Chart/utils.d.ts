import type { MetricNodes } from './nodes'
export declare function clearCtx(chart: any, ctx?: any): void
export declare function getDateDayMonthYear(date: number | Date): string
export declare function getDateHoursMinutes(date: number | Date): string
export declare function yBubbleFormatter(value: number): string
export declare function getDefaultTooltipSettings(): {
  datetime: {
    formatter: (value: number) => string
  }
  spentCoinCost: {
    formatter: (value: any) => any
    label: string
  }
}
export declare function linearDatetimeScale(chart: any): (value: number) => any
export declare function isDayInterval(chart: any): boolean
export declare function findPointByDate(points: any, target: number): any
export declare function mapClosestValue(data: any[], MetricNodes: MetricNodes): any[]
