import { drawValueBubbleY } from 'san-chart/tooltip'
import { MetricGroup } from '@/metrics/graph'
import { millify } from 'webkit/utils/formatting'

export const Y_MARGIN = 20
export const MULTI_AXIS_WIDTH = 50

export function getPadding(chart: Studio.Chart, axesMetricKeys: any[]) {
  return {
    ...chart.padding,
    bottom: 70,
    right: axesMetricKeys.length * MULTI_AXIS_WIDTH + Y_MARGIN,
  }
}

// NOTE: http://stackoverflow.com/a/3943023/112731 [@vanguard | Mar  9, 2021]
export function getBubbleFontColorHex(color: string, isNightMode = false) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  const threshold = 175 - (isNightMode ? 37 : 0)
  return r * 0.299 + g * 0.587 + b * 0.114 > threshold ? '#000000' : '#ffffff'
}

export function getBubbleTheme(theme: any, color: string) {
  return Object.assign({}, theme.bubbles, {
    bgColor: color,
    textColor: getBubbleFontColorHex(color),
  })
}

export function yAxisFormatter(value: number) {
  const absValue = Math.abs(value)

  if (!value) {
    return 0
  }

  if (absValue < 10) {
    return +value.toFixed(3)
  }

  if (absValue < 100) {
    return millify(value, 3)
  }

  if (absValue > 999999) {
    return millify(value, 2)
  }

  if (absValue > 99999) {
    return millify(value, 0)
  }

  if (absValue > 9999) {
    return millify(value, 1)
  }

  return Math.trunc(value)
}

export function getMetricAxisFormatter(metricSettings, key) {
  return metricSettings[key].axisFormatter || yAxisFormatter
}

export function getDomainObject(domainGroups: string[][]) {
  const domain = {}
  for (let i = domainGroups.length - 1; i >= 0; i--) {
    const group = domainGroups[i]
    if (group) domain[group[0]] = group.slice(1)
  }
  return domain
}

export function plotMetricLastValueBubble(
  chart,
  metricKey,
  metricSettings,
  LastMetricPoint,
  offset,
  color,
) {
  const point = LastMetricPoint[metricKey]
  if (!point) return

  let { y, value } = point
  const { ctx, theme } = chart

  const bubbleTheme = getBubbleTheme(theme.bubbles, color)
  const formatter = getMetricAxisFormatter(metricSettings, metricKey)

  value = formatter(value)
  drawValueBubbleY(chart, ctx, value, y, bubbleTheme, offset)
}
