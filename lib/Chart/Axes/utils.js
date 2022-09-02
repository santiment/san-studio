import { drawValueBubbleY } from '@santiment-network/chart/tooltip'
import { millify } from 'san-webkit/lib/utils/formatting'
export const Y_MARGIN = 25
export const X_MARGIN = 20
export const MULTI_AXIS_WIDTH = 50
export function getPadding(chart, axesMetricKeys) {
  const { padding, rightAxisMargin = Y_MARGIN } = chart
  const axesLength = axesMetricKeys.length
  return Object.assign(Object.assign({}, padding), {
    bottom: padding.bottom > X_MARGIN ? padding.bottom : X_MARGIN,
    right: axesLength * MULTI_AXIS_WIDTH + (axesLength ? rightAxisMargin : 3),
  })
}
// NOTE: http://stackoverflow.com/a/3943023/112731 [@vanguard | Mar  9, 2021]
export function getBubbleFontColorHex(color, isNightMode = false) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const threshold = 175 - (isNightMode ? 37 : 0)
  return r * 0.299 + g * 0.587 + b * 0.114 > threshold ? '#000000' : '#ffffff'
}
export function getBubbleTheme(theme, color) {
  return Object.assign({}, theme.bubbles, {
    bgColor: color,
    textColor: getBubbleFontColorHex(color),
  })
}
export function yAxisFormatter(value) {
  const absValue = Math.abs(value)
  if (!value) {
    return 0
  }
  if (absValue < 0.01) {
    return +value.toFixed(6)
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
  var _a
  return (
    ((_a = metricSettings[key]) === null || _a === void 0 ? void 0 : _a.axisFormatter) ||
    yAxisFormatter
  )
}
export function getDomainObject(domainGroups) {
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
export function getXTicksByWidth(width = 0) {
  if (width < 400) return 3
  if (width < 600) return 5
  if (width < 800) return 6
  if (width < 900) return 8
  if (width < 1200) return 10
  return 12
}
const DEFAULT_METRIC_KEYS = []
export function getResponsiveAxesKeys(width = 0, axesMetricKeys) {
  return width > 500 ? axesMetricKeys : DEFAULT_METRIC_KEYS
}
//# sourceMappingURL=utils.js.map
